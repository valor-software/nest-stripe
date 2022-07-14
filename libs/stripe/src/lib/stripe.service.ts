import { Inject, Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CreatePaymentResponse } from './dto/create-payment.response';
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

  async createCheckoutSession(dto: CreateCheckoutSessionDto): Promise<CreatePaymentResponse> {
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
        id: session.id
      };
    } catch (exception) {
      this.logger.error('Stripe: Create Checkout Session error', exception);
      return {
        success: false,
        errorMessage: 'Stripe: Create Checkout Session error'
      }
    }
  }

  buildWebhookEvent(payload: string, headerSignature: string) {
    return this.stripe.webhooks.constructEventAsync(payload, headerSignature, this.config.webHookSignature);
  }
}
