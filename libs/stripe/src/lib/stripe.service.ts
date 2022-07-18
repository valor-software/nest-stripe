import { Inject, Injectable } from '@nestjs/common';
import e = require('express');
import { Stripe } from 'stripe';
import {
  CreateCheckoutSessionDto,
  CreateCustomerDto,
  CustomerResponse,
  CheckoutSessionResponse,
  CreatePriceDto,
  PriceResponse,
  CreateSubscriptionDto,
  SubscriptionResponse,
  InvoicePreviewDto,
  InvoicePreviewResponse,
  CancelSubscriptionDto,
  BaseResponse,
  SubscriptionsResponse,
} from './dto';
import { StripeConfig, STRIPE_CONFIG } from './stripe.config';
import { StripeLogger } from './stripe.logger';

@Injectable()
export class StripeService {
  protected stripe: Stripe = new Stripe(this.config.apiKey, {
    apiVersion: '2020-08-27'
  });

  constructor(
    @Inject(STRIPE_CONFIG) protected readonly config: StripeConfig,
    private readonly logger: StripeLogger
  ) {}

  async createCheckoutSession(dto: CreateCheckoutSessionDto): Promise<CheckoutSessionResponse> {
    try {
      const metadata = dto.metadata;
      const lineItems = dto.items.map(item => ({
        price_data: {
          currency: this.config.currency || 'USD',
          product_data: {
            name: item.displayName,
            images: item.images,
            metadata: {
              ...item,
            },
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      } as unknown as Stripe.Checkout.SessionCreateParams.LineItem));
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: this.config.paymentMethods || ['card'],
        line_items: lineItems,
        mode: 'payment',
        metadata,
        payment_intent_data: {
          metadata,
        },
        success_url: this.config.successUrl,
        cancel_url: this.config.cancelUrl,
      });
      return {
        success: true,
        sessionId: session.id
      };
    } catch (exception) {
      return this.handleError(exception, 'Create Checkout Session');
    }
  }

  async createCustomer(dto: CreateCustomerDto): Promise<CustomerResponse> {
    try {
      const customer = await this.stripe.customers.create({
        email: dto.email,
        name: dto.name,
        description: dto.description,
        phone: dto.phone,
        address: dto.addressLine1 || dto.addressLine2 ? {
          line1: dto.addressLine1, line2: dto.addressLine2
        } : null,
        invoice_prefix: dto.invoicePrefix,
        metadata:dto.metadata,
        payment_method: dto.paymentMethod,
        preferred_locales: dto.preferredLocales,
        promotion_code: dto.promotionCode,
        source: dto.source,
        shipping: dto.shipping ? {
          name: dto.shipping.name,
          address: { line1: dto.shipping.address, line2: dto.shipping.addressLine2 },
          phone: dto.shipping.phone
        } : null,
        tax_exempt: dto.taxExempt
      })
      return { customerId: customer.id, success: true };
    } catch (exception) {
      return this.handleError(exception, 'Create Customer');
    }
  }

  async createPrice(dto: CreatePriceDto): Promise<PriceResponse> {
    try {
      const price = await this.stripe.prices.create({
        currency: dto.currency || this.config.currency || 'USD',
        active: dto.active != undefined ? dto.active : true,
        billing_scheme: dto.billingScheme,
        lookup_key: dto.lookupKey,
        metadata: dto.metadata,
        nickname: dto.nickname,
        product: dto.productId,
        product_data: dto.productData ? {
          active: dto.productData.active != undefined ? dto.productData.active : true,
          metadata: dto.productData.metadata,
          name: dto.productData.name,
          statement_descriptor: dto.productData.statementDescriptor,
          tax_code: dto.productData.taxCode,
          unit_label: dto.productData.unitLabel
        } : undefined,
        recurring: dto.recurring ? {
          aggregate_usage: dto.recurring.aggregateUsage,
          interval: dto.recurring.interval,
          interval_count: dto.recurring.intervalCount,
          trial_period_days: dto.recurring.trialPeriod_Days,
          usage_type: dto.recurring.usageType
        } : null,
        tax_behavior: dto.taxBehavior,
        tiers_mode: dto.tiersMode,
        transfer_lookup_key: dto.transferLookupKey,
        unit_amount: dto.amount
      });
      return {
        success: true,
        priceId: price.id
      };
    } catch (exception) {
      return this.handleError(exception, 'Create Price');
    }
  }

  async createSubscription(dto: CreateSubscriptionDto): Promise<SubscriptionResponse> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: dto.customerId,
        items: [{
          price: dto.priceId
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      });
      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice?.payment_intent as Stripe.PaymentIntent;
      return {
        subscriptionId: subscription.id,
        clientSecret: paymentIntent?.client_secret
      }
    } catch (exception) {
      return this.handleError(exception, 'Create Subscription');
    }
  }

  async customerSubscriptions(customerId: string): Promise<SubscriptionsResponse> {
    try {
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        expand: ['data.default_payment_method'],
      });
      return {
        success: true,
        subscriptions: subscriptions.data
      }
    } catch (exception) {
      return this.handleError(exception, 'Customer Subscription list');
    }
  }

  async cancelSubscription(dto: CancelSubscriptionDto): Promise<SubscriptionResponse> {
    try {
      const subscription = await this.stripe.subscriptions.del(dto.subscriptionId);
      
      return {
        success: true,
        subscriptionId: subscription.id,
      }
    } catch (exception) {
      return this.handleError(exception, 'Cancel Subscription');
    }
  }

  async updateDefaultSubscriptionPaymentMethodFromPaymentIntent(subscriptionId: string, paymentIntentId: string): Promise<BaseResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        default_payment_method: paymentIntent.payment_method as string
      })
      return { success: true }
    } catch(exception) {
      return this.handleError(exception, 'Update Default Subscription Payment Method From PaymentIntent')
    }
  }

  async invoicePreview(dto: InvoicePreviewDto): Promise<InvoicePreviewResponse> {
    try {
      const invoice = await this.stripe.invoices.retrieveUpcoming({
        customer: dto.customerId,
        subscription: dto.subscriptionId
      })
      return {
        success: true,
        invoice,
      }
    } catch (exception) {
      return this.handleError(exception, 'Invoice Preview');
    }
  }

  buildWebhookEvent(payload: string, headerSignature: string) {
    return this.stripe.webhooks.constructEventAsync(payload, headerSignature, this.config.webHookSignature);
  }

  private handleError(exception: any, context: string): BaseResponse {
    this.logger.error(`Stripe: ${context} error`, exception, exception.stack);
    return {
      success: false,
      errorMessage: `Stripe: ${context} error: ${exception.message}`
    }
  }
}
