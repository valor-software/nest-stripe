import { Inject, Injectable, Logger } from '@nestjs/common';
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
  SubscriptionDto,
  TaxRate,
  InvoiceLineItemDto,
  InvoiceDto,
  CreateUsageRecordDto,
  CreateUsageRecordResponse,
  UsageRecordDto,
  PriceDto,
  PlanDto,
  ProductDto,
  SubscriptionItemDto,
  CreatePaymentMethodDto,
  CreatePaymentMethodResponse,
  Card1Dto,
  Card2Dto,
  BaseDataResponse,
  SaveQuoteResponse,
  SaveQuoteDto,
  AddressDto,
  QuoteDto,
  CreateSubscriptionItemDto,
  CreatePaymentIntentDto,
  PaymentIntentResponse,
  PaymentIntentDto,
  UpdateSubscriptionDto,
  CustomerDto,
  PaymentMethodDto,
  PaymentItemDto,
  CreateProductDto,
  ProductResponse,
  UpdatePriceDto,
  UpdateProductDto,
  UpdateCustomerDto,
  WebhookEndpointDto,
  CreateWebhookEndpointDto,
  UpdateWebhookEndpointDto,
  BaseSaveResponse,
  UpcomingInvoiceDto,
  SubscriptionScheduleDto,
  CreateSubscriptionScheduleDto,
  SchedulePhaseDto,
  UpdateSubscriptionScheduleDto,
  ListRequestParamsDto,
} from './dto';
import { StripeConfig, STRIPE_CONFIG } from './stripe.config';
import { StripeLogger } from './stripe.logger';

@Injectable()
export class StripeService {
  protected stripe: Stripe = new Stripe(this.config.apiKey, {
    apiVersion: '2022-11-15'
  });

  constructor(
    @Inject(STRIPE_CONFIG) protected readonly config: StripeConfig,
    private readonly logger: StripeLogger
  ) {}

  //#region Payment Intent
  async createPaymentIntent(dto: CreatePaymentIntentDto): Promise<PaymentIntentResponse> {
    try {
      const validateRes = this.validateItems(dto.items);
      if (!validateRes.success) {
        return validateRes;
      }
      const amount = dto.items.reduce((a,b) => a += b.quantity * b.price, 0);
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency: dto.currency || this.config.currency || 'usd',
        customer: dto.customer,
        description: dto.description,
        payment_method_types: this.config.paymentMethods,
        metadata: dto.metadata
      })
      return {
        success: true,
        clientSecret: paymentIntent.client_secret
      }
    } catch (exception) {
      return this.handleError(exception, 'Create Payment Intent');
    }
  }

  async getPaymentIntentById(id: string): Promise<BaseDataResponse<PaymentIntentDto>> {
    try {
      const pi = await this.stripe.paymentIntents.retrieve(id);
      return {
        success: true,
        data: this.paymentIntentToDto(pi)
      };
    } catch (exception) {
      return this.handleError(exception, 'Get Payment Intent');
    }
  }

  async createCheckoutSession(dto: CreateCheckoutSessionDto): Promise<CheckoutSessionResponse> {
    try {
      const validateRes = this.validateItems(dto.items);
      if (!validateRes.success) {
        return validateRes;
      }
      const metadata = dto.metadata;
      const lineItems = dto.items.map(item => ({
        price: item.priceId,
        price_data: item.priceId ? undefined : {
          currency: dto.currency || this.config.currency || 'usd',
          product: item.productId,
          product_data: item.productId ? undefined : {
            name: item.displayName,
            images: item.images,
          },
          unit_amount: item.price * item.quantity,
          recurring: dto.recurringInterval ? {
            interval: dto.recurringInterval,
            interval_count: dto.recurringIntervalCount
          } : undefined,
        },
        quantity: item.quantity,
      } as Stripe.Checkout.SessionCreateParams.LineItem));
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: this.config.paymentMethods || ['card'],
        line_items: lineItems,
        mode: dto.mode || 'payment',
        metadata,
        payment_intent_data: {
          metadata,
        },
        success_url: this.config.successUrl,
        cancel_url: this.config.cancelUrl,
        customer: dto.customer,
        currency: dto.currency || this.config.currency || 'usd',
        expand: ['payment_intent']
      });
      const pi = session.payment_intent as Stripe.PaymentIntent;
      return {
        success: true,
        sessionId: session.id,
        clientSecret: pi?.client_secret
      };
    } catch (exception) {
      return this.handleError(exception, 'Create Checkout Session');
    }
  }
  //#endregion

  //#region Customer
  async createCustomer(dto: CreateCustomerDto): Promise<CustomerResponse> {
    try {
      let paymentMethod = dto.paymentMethod;
      if (!dto.paymentMethod && dto.paymentMethodData) {
        const response = await this.createPaymentMethod(dto.paymentMethodData);
        if (!response.success) {
          return response;
        }
        paymentMethod = response.paymentMethodId;
      }
      const customer = await this.stripe.customers.create({
        email: dto.email,
        name: dto.name,
        description: dto.description,
        phone: dto.phone,
        address: this.addressFromDto(dto.address),
        invoice_prefix: dto.invoicePrefix,
        metadata:dto.metadata,
        payment_method: paymentMethod,
        preferred_locales: dto.preferredLocales,
        promotion_code: dto.promotionCode,
        source: dto.source,
        shipping: dto.shipping ? {
          name: dto.shipping.name,
          address: this.addressFromDto(dto.shipping.address),
          phone: dto.shipping.phone
        } : undefined,
        tax_exempt: dto.taxExempt,
        test_clock: dto.testClock
      });
      return { customerId: customer.id, success: true };
    } catch (exception) {
      return this.handleError(exception, 'Create Customer');
    }
  }

  async updateCustomer(customerId: string, dto: UpdateCustomerDto): Promise<CustomerResponse> {
    try {
      const customer = await this.stripe.customers.update(customerId, {
        email: dto.email,
        name: dto.name,
        description: dto.description,
        phone: dto.phone,
        address: this.addressFromDto(dto.address),
        invoice_prefix: dto.invoicePrefix,
        metadata:dto.metadata,
        preferred_locales: dto.preferredLocales,
        promotion_code: dto.promotionCode,
        source: dto.source,
        shipping: dto.shipping ? {
          name: dto.shipping.name,
          address: this.addressFromDto(dto.shipping.address),
          phone: dto.shipping.phone
        } : null,
        tax_exempt: dto.taxExempt
      });
      return { customerId: customer.id, success: true };
    } catch (exception) {
      return this.handleError(exception, 'Create Customer');
    }
  }

  async getCustomer(customerId: string): Promise<BaseDataResponse<CustomerDto>> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      return {
        success: true,
        data: this.customerToDto(customer as Stripe.Customer)
      }
    } catch (exception) {
      return this.handleError(exception, 'Get Customer');
    }
  }

  async getCustomersByEmail(email: string): Promise<BaseDataResponse<CustomerDto[]>> {
    try {
      const query = `email:"${email}"`;
      const customer = await this.stripe.customers.search({query});
      return {
        success: true,
        data: customer.data.map(c => this.customerToDto(c))
      }
    } catch (exception) {
      return this.handleError(exception, 'Get Customer List by Email');
    }
  }

  async attachPaymentMethod(paymentMethodId: string, customerId: string, useAsDefault?: boolean): Promise<CreatePaymentMethodResponse> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });
      if (useAsDefault) {
        await this.stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
      }
      return { success: true, paymentMethodId: paymentMethod.id }
    } catch (exception) {
      return this.handleError(exception, 'Attach Payment Method');
    }
  }

  async detachPaymentMethod(paymentMethodId: string): Promise<CreatePaymentMethodResponse> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.detach(paymentMethodId);
      return { success: true, paymentMethodId: paymentMethod.id }
    } catch (exception) {
      return this.handleError(exception, 'Detach Payment Method');
    }
  }

  async customerPaymentMethodList(
    customerId: string, type: Stripe.PaymentMethodListParams.Type, params?: ListRequestParamsDto
  ): Promise<BaseDataResponse<PaymentMethodDto[]>> {
    try {
      const paymentMethods = await this.stripe.customers.listPaymentMethods(customerId, {
        type,
        limit: params.limit,
        starting_after: params.startingAfter,
        ending_before: params.endingBefore,
      });
      return {
        success: true,
        data: paymentMethods.data.map(pm => this.paymentMethodToDto(pm))
      }
    } catch (exception) {
      return this.handleError(exception, 'Customer Payment Method List');
    }
  }

  async customerInvoices(customerId: string, params?: ListRequestParamsDto): Promise<BaseDataResponse<InvoiceDto[]>> {
    try {
      const invoices = await this.stripe.invoices.list({
        customer: customerId,
        starting_after: params.startingAfter,
        ending_before: params.endingBefore,
        limit: params.limit,
      });
      return {
        success: true,
        data: invoices.data?.map(i => this.invoiceToDto(i))
      }
    } catch (exception) {
      return this.handleError(exception, 'Customer Subscription list');
    }
  }
  //#endregion

  //#region Payment Method
  async createPaymentMethod(dto: CreatePaymentMethodDto): Promise<CreatePaymentMethodResponse> {
    try {
      let card: Stripe.PaymentMethodCreateParams.Card1 | Stripe.PaymentMethodCreateParams.Card2 = dto.card as Card2Dto;
      if ((dto.card as Card1Dto)?.number) {
        const cardDto = (dto.card as Card1Dto)
        card = {
          number: cardDto.number,
          cvc: cardDto.cvc,
          exp_month: cardDto.expMonth,
          exp_year: cardDto.expYear
        } as Stripe.PaymentMethodCreateParams.Card1;
      }
      const payload = {
        acss_debit: dto.acssDebit ? {
          account_number: dto.acssDebit.accountNumber,
          institution_number: dto.acssDebit.institutionNumber,
          transit_number: dto.acssDebit.transitNumber
        } : undefined,
        affirm: dto.affirm,
        afterpay_clearpay: dto.afterPayClearPay,
        alipay: dto.aliPay,
        au_becs_debit: dto.auBecsDebit ? {
          account_number: dto.auBecsDebit.accountNumber,
          bsb_number: dto.auBecsDebit.bsbNumber
        } : undefined,
        bacs_debit: dto.bacsDebit ? {
          account_number: dto.bacsDebit.accountNumber,
          sort_code: dto.bacsDebit.sortCode
        } : undefined,
        bancontact: dto.banContact,
        billing_details: dto.billingDetails ? {
          address: {...dto.billingDetails.address, postal_code: dto.billingDetails.address.postalCode, postalCode: undefined },
          email: dto.billingDetails.email,
          name: dto.billingDetails.name,
          phone: dto.billingDetails.phone,
        } : undefined,
        boleto: dto.boleto ? { tax_id: dto.boleto.taxId } : undefined,
        card,
        customer: dto.customer,
        customer_balance: dto.customerBalance,
        eps: dto.eps ? { bank: dto.eps.bank } : undefined,
        fpx: dto.fpx ? {
          account_holder_type: dto.fpx.accountHolderType,
          bank: dto.fpx.bank
        } : undefined,
        giropay: dto.giroPay,
        grabpay: dto.grabPay,
        ideal: dto.ideal,
        interac_present: dto.interacPresent,
        klarna: dto.klarna ? {
          dob: {
            day: dto.klarna.dobDay,
            month: dto.klarna.dobMonth,
            year: dto.klarna.dobYear
          }
        } : undefined,
        konbini: dto.konbini,
        link: dto.link,
        metadata: dto.metadata,
        p24: dto.p24,
        paynow: dto.payNow,
        promptpay: dto.promptpay,
        radar_options: dto.radar_session ? { session: dto.radar_session } : undefined,
        sepa_debit: dto.sepaDebitIban ? { iban: dto.sepaDebitIban } : undefined,
        sofort: dto.sofortCountry ? { country: dto.sofortCountry } : undefined,
        type: dto.type,
        us_bank_account: dto.usBankAccount ? {
          account_holder_type: dto.usBankAccount.accountHolderType,
          account_number: dto.usBankAccount.accountNumber,
          account_type: dto.usBankAccount.accountType,
          financial_connections_account: dto.usBankAccount.financialConnectionsAccount,
          routing_number: dto.usBankAccount.routingNumber,
        } : undefined,
        wechat_pay: dto.wechatPay
      } as Stripe.PaymentMethodCreateParams;
      const paymentMethod = await this.stripe.paymentMethods.create(payload);
      return { success: true, paymentMethodId: paymentMethod.id };
    } catch (exception) {
      return this.handleError(exception, 'Create Payment Method');
    }
  }
  //#endregion

  //#region Price
  async createPrice(dto: CreatePriceDto): Promise<PriceResponse> {
    try {
      const payload = {
        currency: dto.currency || this.config.currency || 'usd',
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
          interval_count: dto.recurring.intervalCount == null ? undefined : dto.recurring.intervalCount,
          trial_period_days: dto.recurring.trialPeriodDays == null ? undefined : dto.recurring.trialPeriodDays,
          usage_type: dto.recurring.usageType
        } : undefined,
        tax_behavior: dto.taxBehavior,
        tiers: dto.tiers ? dto.tiers.map(t => ({
          flat_amount: t.flatAmount,
          flat_amount_decimal: t.flatAmountDecimal,
          unit_amount: t.unitAmount,
          unit_amount_decimal: t.unitAmountDecimal,
          up_to: t.upTo || 'inf'
        })) : undefined,
        tiers_mode: dto.tiersMode,
        transfer_lookup_key: dto.transferLookupKey,
        unit_amount: dto.amount == null ? undefined : dto.amount,
        expand: dto.expand
      } as Stripe.PriceCreateParams;
      const price = await this.stripe.prices.create(payload);
      return {
        success: true,
        priceId: price.id
      };
    } catch (exception) {
      return this.handleError(exception, 'Create Price');
    }
  }

  async updatePrice(priceId: string, dto: UpdatePriceDto): Promise<PriceResponse> {
    try {
      const payload = {
        currency: dto.currency || this.config.currency || 'usd',
        active: dto.active != undefined ? dto.active : true,
        billing_scheme: dto.billingScheme,
        lookup_key: dto.lookupKey,
        metadata: dto.metadata,
        nickname: dto.nickname,
        recurring: dto.recurring ? {
          aggregate_usage: dto.recurring.aggregateUsage,
          interval: dto.recurring.interval,
          interval_count: dto.recurring.intervalCount == null ? undefined : dto.recurring.intervalCount,
          trial_period_days: dto.recurring.trialPeriodDays == null ? undefined : dto.recurring.trialPeriodDays,
          usage_type: dto.recurring.usageType
        } : undefined,
        tax_behavior: dto.taxBehavior,
        tiers_mode: dto.tiersMode,
        transfer_lookup_key: dto.transferLookupKey
      } as Stripe.PriceUpdateParams;
      const price = await this.stripe.prices.update(priceId, payload);
      return {
        success: true,
        priceId: price.id
      };
    } catch (exception) {
      return this.handleError(exception, 'Create Price');
    }
  }

  async getPriceById(id: string): Promise<BaseDataResponse<PriceDto>> {
    try {
      const price = await this.stripe.prices.retrieve(id, {
        expand: ['tiers']
      });
      return {
        success: true,
        data: this.priceToDto(price)
      }
    } catch (exception) {
      return this.handleError(exception, 'Get Price');
    }
  }

  async getPriceList(productId?: string, params?: ListRequestParamsDto): Promise<BaseDataResponse<PriceDto[]>> {
    try {
      const expand = ['data.tiers'];
      if (!productId) {
        expand.push('data.product')
      }
      console.log(expand)
      const prices = await this.stripe.prices.list({
        product: productId,
        expand,
        limit: params.limit,
        starting_after: params.startingAfter,
        ending_before: params.endingBefore,
      });
      return {
        success: true,
        data: prices.data.map((p) => this.priceToDto(p))
      };
    } catch (exception) {
      return this.handleError(exception, 'Get Price List');
    }
  }
  //#endregion

  //#region Product
  async createProduct(dto: CreateProductDto): Promise<ProductResponse> {
    try {
      const payload = {
        name: dto.name,
        active: dto.active,
        attributes: dto.attributes,
        caption: dto.caption,
        deactivate_on: dto.deactivateOn,
        default_price_data: dto.defaultPriceData ? {
          currency: dto.defaultPriceData.currency,
          currency_options: dto.defaultPriceData.currencyOptions,
          recurring: dto.defaultPriceData.recurring ? {
            interval: dto.defaultPriceData.recurring.interval,
            interval_count: dto.defaultPriceData.recurring.intervalCount
          } : undefined,
          tax_behavior: dto.defaultPriceData.taxBehavior,
          unit_amount: dto.defaultPriceData.unitAmount,
          unit_amount_decimal: dto.defaultPriceData.unitAmountDecimal
        } : undefined,
        description: dto.description,
        images: dto.images,
        metadata: dto.metadata,
        package_dimensions: dto.packageDimensions,
        shippable: dto.shippable,
        statement_descriptor: dto.statementDescriptor,
        tax_code: dto.taxCode,
        type: dto.type,
        unit_label: dto.unitLabel,
        url: dto.url
      } as Stripe.ProductCreateParams;
      const product = await this.stripe.products.create(payload);
      return {
        success: true,
        productId: product.id,
        defaultPriceId: product.default_price as string
      };
    } catch (exception) {
      return this.handleError(exception, 'Create Product');
    }
  }

  async updateProduct(productId: string, dto: UpdateProductDto): Promise<ProductResponse> {
    try {
      const payload = {
        name: dto.name,
        active: dto.active,
        attributes: dto.attributes,
        caption: dto.caption,
        deactivate_on: dto.deactivateOn,
        description: dto.description,
        images: dto.images,
        metadata: dto.metadata,
        package_dimensions: dto.packageDimensions,
        shippable: dto.shippable,
        statement_descriptor: dto.statementDescriptor,
        tax_code: dto.taxCode,
        unit_label: dto.unitLabel,
        url: dto.url
      } as Stripe.ProductUpdateParams;
      const product = await this.stripe.products.update(productId, payload);
      return {
        success: true,
        productId: product.id,
        defaultPriceId: product.default_price as string
      };
    } catch (exception) {
      return this.handleError(exception, 'Create Product');
    }
  }

  async deleteProduct(productId: string): Promise<ProductResponse> {
    try {
      const product = await this.stripe.products.del(productId);
      return {
        success: true,
        productId: product.id
      };
    } catch (exception) {
      return this.handleError(exception, 'Delete Product');
    }
  }

  async getProductList(params?: ListRequestParamsDto): Promise<BaseDataResponse<ProductDto[]>> {
    try {
      const productList = await this.stripe.products.list({
        limit: params.limit,
        starting_after: params.startingAfter
      });
      const products = productList.data.map((p) => this.productToDto(p));
      await Promise.all(products.map(async (p, i) => {
        const prices = await this.getPriceList(p.id);
        products[i].prices = prices.data;
      }))
      return {
        success: true,
        data: products
      };
    } catch (exception) {
      return this.handleError(exception, 'Get Product List');
    }
  }

  async getProductListByName(name: string): Promise<BaseDataResponse<ProductDto[]>> {
    try {
      const query = `name:"${name}"`;
      const productList = await this.stripe.products.search({query});
      const products = productList.data.map((p) => this.productToDto(p));
      await Promise.all(products.map(async (p, i) => {
        const prices = await this.getPriceList(p.id);
        products[i].prices = prices.data;
      }))
      return {
        success: true,
        data: products
      };
    } catch (exception) {
      return this.handleError(exception, 'Get Product List');
    }
  }

  async getProductById(productId: string): Promise<BaseDataResponse<ProductDto>> {
    try {
      const product = await this.stripe.products.retrieve(productId);
      return {
        success: true,
        data: this.productToDto(product)
      }
    } catch (exception) {
      return this.handleError(exception, 'Get Price List');
    }
  }
  //#endregion 

  //#region Subscription
  async createSubscription(dto: CreateSubscriptionDto): Promise<SubscriptionResponse> {
    try {
      this.stripe.events
      const subscription = await this.stripe.subscriptions.create({
        customer: dto.customerId,
        items: dto.items.map(i => ({
          price: i.priceId,
          plan: i.planId,
          quantity: i.quantity
        })),
        add_invoice_items: dto.addInvoiceItems?.map(i => ({
          price: i.priceId,
          quantity:i.quantity,
          tax_rates: i.taxRates
        })),
        application_fee_percent: dto.applicationFeePercent,
        automatic_tax: dto.automaticTax,
        backdate_start_date: dto.backdateStartDate,
        billing_cycle_anchor: dto.billingCycleAnchor,
        billing_thresholds: dto.billingThresholds ? {
          amount_gte: dto.billingThresholds.amountGte,
          reset_billing_cycle_anchor: dto.billingThresholds.resetBillingCycleAnchor
        } : undefined,
        cancel_at: dto.cancelAt,
        cancel_at_period_end: dto.cancelAtPeriodEnd,
        collection_method: dto.collectionMethod,
        coupon: dto.couponId,
        default_payment_method: dto.defaultPaymentMethod,
        description: dto.description,
        metadata: dto.metadata,
        payment_behavior: dto.paymentBehavior || 'default_incomplete',
        days_until_due: dto.daysUntilDue,
        default_source: dto.defaultSource,
        default_tax_rates: dto.defaultTaxRates,
        off_session: dto.offSession,
        payment_settings: dto.paymentSettings ? {
          payment_method_options: dto.paymentSettings.paymentMethodOptions ? {
            card: dto.paymentSettings.paymentMethodOptions.card ? {
              mandate_options: {
                amount: dto.paymentSettings.paymentMethodOptions.card.mandateOptions.amount,
                amount_type: dto.paymentSettings.paymentMethodOptions.card.mandateOptions.amountType,
                description: dto.paymentSettings.paymentMethodOptions.card.mandateOptions.description
              },
              request_three_d_secure: dto.paymentSettings.paymentMethodOptions.card.requestThreeDSecure
            } : undefined,
            us_bank_account: {
              financial_connections: {
                permissions: dto.paymentSettings.paymentMethodOptions.usBankAccount?.financialConnections
              },
              verification_method: dto.paymentSettings.paymentMethodOptions.usBankAccount?.verificationMethod
            }
          } : undefined,
          payment_method_types: dto.paymentSettings.paymentMethodTypes,
          save_default_payment_method: dto.paymentSettings.saveDefaultPaymentMethod
        } : undefined,
        promotion_code: dto.promotionCode,
        trial_end: dto.trialEnd,
        trial_from_plan: dto.trialFromPlan,
        trial_period_days: dto.trialPeriodDays,
        expand: ['latest_invoice.payment_intent']
      });
      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice?.payment_intent as Stripe.PaymentIntent;
      return {
        success: true,
        subscriptionId: subscription.id,
        status: subscription.status,
        clientSecret: paymentIntent?.client_secret,
        paymentIntentStatus: paymentIntent?.status,
        latestInvoiceId: paymentIntent?.id
      }
    } catch (exception) {
      return this.handleError(exception, 'Create Subscription');
    }
  }

  async updateSubscription(subscriptionId: string, dto: UpdateSubscriptionDto): Promise<SubscriptionResponse> {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        items: dto.items?.map(i => ({
          id: i.id,
          price: i.priceId,
          plan: i.planId,
          quantity: i.quantity
        })),
        add_invoice_items: dto.addInvoiceItems?.map(i => ({
          price: i.priceId,
          quantity:i.quantity,
          tax_rates: i.taxRates
        })),
        application_fee_percent: dto.applicationFeePercent,
        automatic_tax: dto.automaticTax,
        billing_cycle_anchor: dto.billingCycleAnchor,
        billing_thresholds: dto.billingThresholds ? {
          amount_gte: dto.billingThresholds.amountGte,
          reset_billing_cycle_anchor: dto.billingThresholds.resetBillingCycleAnchor
        } : undefined,
        cancel_at: dto.cancelAt,
        cancel_at_period_end: dto.cancelAtPeriodEnd,
        collection_method: dto.collectionMethod,
        coupon: dto.couponId,
        default_payment_method: dto.defaultPaymentMethod,
        description: dto.description,
        metadata: dto.metadata,
        payment_behavior: dto.paymentBehavior,
        days_until_due: dto.daysUntilDue,
        default_source: dto.defaultSource,
        default_tax_rates: dto.defaultTaxRates,
        off_session: dto.offSession,
        payment_settings: dto.paymentSettings ? {
          payment_method_options: dto.paymentSettings.paymentMethodOptions ? {
            card: dto.paymentSettings.paymentMethodOptions.card ? {
              mandate_options: {
                amount: dto.paymentSettings.paymentMethodOptions.card.mandateOptions.amount,
                amount_type: dto.paymentSettings.paymentMethodOptions.card.mandateOptions.amountType,
                description: dto.paymentSettings.paymentMethodOptions.card.mandateOptions.description
              },
              request_three_d_secure: dto.paymentSettings.paymentMethodOptions.card.requestThreeDSecure
            } : undefined,
            us_bank_account: {
              financial_connections: {
                permissions: dto.paymentSettings.paymentMethodOptions.usBankAccount?.financialConnections
              },
              verification_method: dto.paymentSettings.paymentMethodOptions.usBankAccount?.verificationMethod
            }
          } : undefined,
          payment_method_types: dto.paymentSettings.paymentMethodTypes,
          save_default_payment_method: dto.paymentSettings.saveDefaultPaymentMethod
        } : undefined,
        promotion_code: dto.promotionCode,
        trial_end: dto.trialEnd,
        trial_from_plan: dto.trialFromPlan,
        proration_behavior: dto.prorationBehavior,
        proration_date: dto.prorationDate ? Math.floor(dto.prorationDate.valueOf() / 1000) : undefined,
        expand: ['latest_invoice.payment_intent']
      });
      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice?.payment_intent as Stripe.PaymentIntent;
      return {
        success: true,
        subscriptionId: subscription.id,
        status: subscription.status,
        clientSecret: paymentIntent?.client_secret,
        paymentIntentStatus: paymentIntent?.status,
        latestInvoiceId: invoice?.id,
        paymentIntentId: paymentIntent?.id
      }
    } catch (exception) {
      return this.handleError(exception, 'Update Subscription');
    }
  }

  async createSubscriptionItem(subscriptionId: string, dto: CreateSubscriptionItemDto): Promise<SubscriptionResponse> {
    try {
      const subscriptionItem = await this.stripe.subscriptionItems.create({
        subscription: subscriptionId,
        price: dto.priceId,
        plan: dto.planId,
        billing_thresholds: dto.billingThresholds ? {
          usage_gte: dto.billingThresholds.usageGte
        } : undefined,
        metadata: dto.metadata,
        payment_behavior: dto.paymentBehavior,
        proration_behavior: dto.prorationBehavior,
        proration_date: dto.proration_date,
        quantity: dto.quantity,
        tax_rates: dto.taxRates,
        expand: ['subscription.latest_invoice.payment_intent']
      });
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionItem.subscription);
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
        subscriptions: subscriptions.data?.map(s => this.subscriptionToDto(s))
      }
    } catch (exception) {
      return this.handleError(exception, 'Customer Subscription list');
    }
  }

  async getSubscriptionById(subscriptionId: string): Promise<BaseDataResponse<SubscriptionDto>> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['default_payment_method'],
      });
      return {
        success: true,
        data: this.subscriptionToDto(subscription)
      }
    } catch (exception) {
      return this.handleError(exception, 'Get Subscription by ID');
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

  async listSubscriptionItems(
    subscriptionId: string, params?: ListRequestParamsDto
  ): Promise<BaseDataResponse<Stripe.SubscriptionItem[]>> {
    try {
      const subscriptionItems = await this.stripe.subscriptionItems.list({
        subscription: subscriptionId,
        limit: params.limit,
        starting_after: params.startingAfter,
        ending_before: params.endingBefore,
      })
      return {
        success: true,
        data: subscriptionItems.data
      }
    } catch (exception) {
      return this.handleError(exception, 'List Usage Record Summaries');
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

  //#endregion

  //#region Usage Record
  async createUsageRecord(subscriptionItemId: string, dto: CreateUsageRecordDto): Promise<CreateUsageRecordResponse> {
    try {
      const usageRecord = await this.stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
        quantity: dto.quantity,
        action: dto.action,
        timestamp: dto.timestamp
      });
      return {
        success: true,
        usageRecord: this.usageRecordToDto(usageRecord)
      }
    } catch (exception) {
      return this.handleError(exception, 'Create Usage Record');
    }
  }

  async listUsageRecordSummaries(
    subscriptionItemId: string, params?: ListRequestParamsDto
  ): Promise<BaseDataResponse<Stripe.UsageRecordSummary[]>> {
    try {
      const usageRecordSummaries = await this.stripe.subscriptionItems.listUsageRecordSummaries(subscriptionItemId, {
        limit: params.limit,
        starting_after: params.startingAfter,
        ending_before: params.endingBefore,
      })
      return {
        success: true,
        data: usageRecordSummaries.data
      }
    } catch (exception) {
      return this.handleError(exception, 'List Usage Record Summaries');
    }
  }
  //#endregion

  //#region Invoice
  async upcomingInvoicePreview(dto: InvoicePreviewDto): Promise<InvoicePreviewResponse> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(dto.subscriptionId);
      const subscription_items = dto.prices?.map((i) => ({
        id: i.id || subscription.items.data.find(x => x.price.id === i.priceId)?.id,
        price: i.priceId,
        quantity: i.quantity
      } as Stripe.InvoiceRetrieveUpcomingParams.SubscriptionItem));
      const invoice_items = dto.prices?.map((i) => ({
        invoiceitem: i.id,
        price: i.priceId,
        quantity: i.quantity
      } as Stripe.InvoiceRetrieveUpcomingParams.InvoiceItem));
      const invoice = await this.stripe.invoices.retrieveUpcoming({
        customer: dto.customerId,
        subscription: dto.subscriptionId,
        subscription_items,
        //invoice_items,
        subscription_proration_behavior: dto.prorationBehavior,
        subscription_proration_date: dto.prorationDate ? Math.floor(dto.prorationDate.valueOf() / 1000) :  Math.floor(Date.now() / 1000)
      })
      return {
        success: true,
        invoice: this.upcomingInvoiceToDto(invoice),
      }
    } catch (exception) {
      return this.handleError(exception, 'Invoice Preview');
    }
  }

  async getInvoiceById(id: string): Promise<BaseDataResponse<InvoiceDto>> {
    try {
      const invoice = await this.stripe.invoices.retrieve(id);
      return {
        success:  true,
        data: this.invoiceToDto(invoice)
      };
    } catch (exception) {
      return this.handleError(exception, 'Get Invoice');
    }
  }
  //#endregion

  //#region Quote
  async createQuote(dto: SaveQuoteDto): Promise<SaveQuoteResponse> {
    try {
      let lineItems = undefined;
      if (dto.lineItems) {
        lineItems = dto.lineItems.map(i => ({
          price: i.price,
          price_data: i.priceData ? {
            currency: i.priceData.currency,
            product: i.priceData.product,
            recurring: i.priceData.recurring ? {
              interval: i.priceData.recurring.interval,
              interval_count: i.priceData.recurring.intervalCount
            } : undefined,
            tax_behavior: i.priceData.taxBehavior,
            unit_amount: i.priceData.unitAmount,
            unit_amount_decimal: i.priceData.unitAmountDecimal
          } : undefined,
          quantity: i.quantity,
          tax_rates: i.taxRates
        } as Stripe.QuoteCreateParams.LineItem))
      }
      const quote = await this.stripe.quotes.create({
        application_fee_amount: dto.applicationFeeAmount,
        application_fee_percent: dto.applicationFeePercent,
        automatic_tax: dto.automaticTaxEnabled != undefined ? { enabled: dto.automaticTaxEnabled } : undefined,
        collection_method: dto.collectionMethod,
        customer: dto.customer,
        default_tax_rates: dto.defaultTaxRates,
        description: dto.description,
        discounts: dto.discounts,
        footer: dto.footer,
        from_quote: dto.fromQuote,
        invoice_settings: dto.invoiceSettings ? { days_until_due: dto.invoiceSettings.daysUntilDue } : undefined,
        line_items: lineItems,
        metadata: dto.metadata,
        on_behalf_of: dto.onBehalfOf,
        subscription_data: dto.subscriptionData ? {
          effective_date: dto.subscriptionData.effectiveDate,
          trial_period_days: dto.subscriptionData.trialPeriodDays
        } : undefined,
        test_clock: dto.testClock,
        transfer_data: dto.transferData
      });
      return {
        success: true,
        quoteId: quote.id,
      }
    } catch (exception) {
      return this.handleError(exception, 'Create Quote');
    }
  }

  async updateQuote(quoteId: string, dto: SaveQuoteDto): Promise<SaveQuoteResponse> {
    try {
      let lineItems = undefined;
      if (dto.lineItems) {
        lineItems = dto.lineItems.map(i => ({
          price: i.price,
          price_data: i.priceData ? {
            currency: i.priceData.currency,
            product: i.priceData.product,
            recurring: i.priceData.recurring ? {
              interval: i.priceData.recurring.interval,
              interval_count: i.priceData.recurring.intervalCount
            } : undefined,
            tax_behavior: i.priceData.taxBehavior,
            unit_amount: i.priceData.unitAmount,
            unit_amount_decimal: i.priceData.unitAmountDecimal
          } : undefined,
          quantity: i.quantity,
          tax_rates: i.taxRates
        } as Stripe.QuoteCreateParams.LineItem))
      }
      const quote = await this.stripe.quotes.update(quoteId, {
        application_fee_amount: dto.applicationFeeAmount,
        application_fee_percent: dto.applicationFeePercent,
        automatic_tax: dto.automaticTaxEnabled != undefined ? { enabled: dto.automaticTaxEnabled } : undefined,
        collection_method: dto.collectionMethod,
        customer: dto.customer,
        default_tax_rates: dto.defaultTaxRates,
        description: dto.description,
        discounts: dto.discounts,
        footer: dto.footer,
        invoice_settings: dto.invoiceSettings ? { days_until_due: dto.invoiceSettings.daysUntilDue } : undefined,
        line_items: lineItems,
        metadata: dto.metadata,
        on_behalf_of: dto.onBehalfOf,
        subscription_data: dto.subscriptionData ? {
          effective_date: dto.subscriptionData.effectiveDate,
          trial_period_days: dto.subscriptionData.trialPeriodDays
        } : undefined,
        transfer_data: dto.transferData
      });
      return {
        success: true,
        quoteId: quote.id,
      }
    } catch (exception) {
      return this.handleError(exception, 'Update Quote');
    }
  }

  async acceptQuote(quoteId: string): Promise<SaveQuoteResponse> {
    try {
      const quote = await this.stripe.quotes.accept(quoteId);
      return {
        success: true,
        quoteId: quote.id,
      }
    } catch (exception) {
      return this.handleError(exception, 'Accept Quote');
    }
  }

  async cancelQuote(quoteId: string): Promise<SaveQuoteResponse> {
    try {
      const quote = await this.stripe.quotes.cancel(quoteId);
      return {
        success: true,
        quoteId: quote.id,
      }
    } catch (exception) {
      return this.handleError(exception, 'Cancel Quote');
    }
  }

  async finalizeQuote(quoteId: string, expiresAt?: number): Promise<SaveQuoteResponse> {
    try {
      const opts: Stripe.QuoteFinalizeQuoteParams = expiresAt ? { expires_at: expiresAt } : undefined;
      const quote = await this.stripe.quotes.finalizeQuote(quoteId, opts);
      return {
        success: true,
        quoteId: quote.id,
      }
    } catch (exception) {
      return this.handleError(exception, 'Finalize Quote');
    }
  }

  async customerQuoteList(
    customerId: string, status?: Stripe.Quote.Status, params?: ListRequestParamsDto
  ): Promise<BaseDataResponse<QuoteDto[]>> {
    try {
      const quotes = await this.stripe.quotes.list({
        customer: customerId,
        status,
        limit: params.limit,
        starting_after: params.startingAfter,
        ending_before: params.endingBefore,
      });
      return {
        success: true,
        data: quotes.data.map(q => this.quoteToDto(q))
      }
    } catch (exception) {
      return this.handleError(exception, 'Get Customer Quotes');
    }
  }
  //#endregion

  //#region Subscription Schedule
  async getSubscriptionScheduleById(scheduleId: string): Promise<BaseDataResponse<SubscriptionScheduleDto>> {
    try {
      const schedule = await this.stripe.subscriptionSchedules.retrieve(scheduleId);
      return {
        success: true,
        data: this.subscriptionScheduleToDto(schedule)
      }
    } catch (exception) {
      return this.handleError(exception, 'Get Subscription Schedule by ID');
    }
  }

  async releaseSubscriptionSchedule(scheduleId: string): Promise<BaseDataResponse<SubscriptionScheduleDto>> {
    try {
      const schedule = await this.stripe.subscriptionSchedules.release(scheduleId);
      
      return {
        success: true,
        data: this.subscriptionScheduleToDto(schedule),
      }
    } catch (exception) {
      return this.handleError(exception, 'Release Subscription Schedule');
    }
  }

  async createSubscriptionSchedule(dto: CreateSubscriptionScheduleDto): Promise<BaseDataResponse<SubscriptionScheduleDto>> {
    try {
      const schedule = await this.stripe.subscriptionSchedules.create({
        customer: dto.customerId,
        end_behavior: dto.endBehavior,
        default_settings: dto.defaultSettings,
        from_subscription: dto.fromSubscription,
        metadata: dto.metadata,
        phases: dto.phases?.map(p => ({
          billing_cycle_anchor: p.billingCycleAnchor,
          currency: p.currency,
          default_payment_method: p.defaultPaymentMethod,
          description: p.description,
          end_date: p.endDate,
          items: p.items?.map(i => ({
            price: i.priceId,
            plan: i.planId,
            quantity: i.quantity
          })),
          proration_behavior: p.prorationBehavior,
          start_date: p.startDate
        })),
        start_date: dto.startDate
      });
      
      return {
        success: true,
        data: this.subscriptionScheduleToDto(schedule),
      }
    } catch (exception) {
      return this.handleError(exception, 'Create Subscription Schedule');
    }
  }

  async updateSubscriptionSchedule(id: string, dto: UpdateSubscriptionScheduleDto): Promise<BaseDataResponse<SubscriptionScheduleDto>> {
    try {
      const schedule = await this.stripe.subscriptionSchedules.update(id, {
        end_behavior: dto.endBehavior,
        default_settings: dto.defaultSettings,
        metadata: dto.metadata,
        phases: dto.phases?.map(p => ({
          billing_cycle_anchor: p.billingCycleAnchor,
          currency: p.currency,
          default_payment_method: p.defaultPaymentMethod,
          description: p.description,
          end_date: p.endDate,
          items: p.items?.map(i => ({
            price: i.priceId,
            plan: i.planId,
            quantity: i.quantity
          })),
          proration_behavior: p.prorationBehavior,
          start_date: p.startDate
        })),
      });
      
      return {
        success: true,
        data: this.subscriptionScheduleToDto(schedule),
      }
    } catch (exception) {
      return this.handleError(exception, 'Update Subscription Schedule');
    }
  }
  //#endregion

  //#region Webhooks

  buildWebhookEvent(payload: string, headerSignature: string) {
    return this.stripe.webhooks.constructEventAsync(payload, headerSignature, this.config.webHookSignature);
  }

  async webhookEndpoints(params?: ListRequestParamsDto): Promise<BaseDataResponse<WebhookEndpointDto[]>> {
    try {
      const webhookEndpoints = await this.stripe.webhookEndpoints.list({
        limit: params.limit,
        starting_after: params.startingAfter,
        ending_before: params.endingBefore,
      });
      return {
        success: true,
        data: webhookEndpoints.data?.map(w => this.webhookEndpointToDto(w))
      }
    } catch (exception) {
      return this.handleError(exception, 'Get Webhook Endpoints');
    }
  }

  async webhookEndpointById(webhookEndpointId: string): Promise<BaseDataResponse<WebhookEndpointDto>> {
    try {
      const webhookEndpoint = await this.stripe.webhookEndpoints.retrieve(webhookEndpointId);
      return {
        success: true,
        data: this.webhookEndpointToDto(webhookEndpoint)
      }
    } catch (exception) {
      return this.handleError(exception, 'Get Webhook Endpoints');
    }
  }

  async createWebhookEndpoint(dto: CreateWebhookEndpointDto): Promise<BaseSaveResponse> {
    try {
      const we = await this.stripe.webhookEndpoints.create({
        enabled_events: dto.enabledEvents,
        url: dto.url,
        connect: dto.connect,
        description: dto.description,
        metadata: dto.metadata
      });
      return {
        success: true,
        recordId: we.id,
      }
    } catch (exception) {
      return this.handleError(exception, 'Create Webhook Endpoint');
    }
  }

  async updateWebhookEndpoint(webhookEndpointId: string, dto: UpdateWebhookEndpointDto): Promise<BaseSaveResponse> {
    try {
      const we = await this.stripe.webhookEndpoints.update(webhookEndpointId,{
        enabled_events: dto.enabledEvents,
        url: dto.url,
        description: dto.description,
        metadata: dto.metadata,
        disabled: dto.disabled
      });
      return {
        success: true,
        recordId: we.id,
      }
    } catch (exception) {
      return this.handleError(exception, 'Update Webhook Endpoint');
    }
  }

  async deleteWebhookEndpoint(webhookEndpointId: string): Promise<BaseResponse> {
    try {
      await this.stripe.webhookEndpoints.del(webhookEndpointId);
      return {
        success: true
      }
    } catch (exception) {
      return this.handleError(exception, 'Delete Webhook Endpoint');
    }
  }
  //#endregion

  private handleError(exception: any, context: string): BaseResponse {
    console.log(exception)
    this.logger.error(`Stripe: ${context} error`, exception, exception.stack);
    return {
      success: false,
      errorMessage: `Stripe: ${context} error: ${exception.message}`
    }
  }

  private validateItems(items: PaymentItemDto[]): BaseResponse {
    if (this.config.validateItems) {
      return this.config.validateItems(items)
    }
    return { success: true };
  }

  private getIdOrDtoFieldValue<T, Q>(stripeValue: Q | null | string, convert: (Q) => T): T | null | string {
    let value: T | null | string = null;
    if (typeof stripeValue === 'string') {
      value = stripeValue;
    } else if (stripeValue != null) {
      value = convert(stripeValue);
    }
    return value;
  }

  //#region To DTO
  private addressToDto(address: Stripe.Address | undefined): AddressDto | undefined {
    if (!address) {
      return address as undefined | null;
    }
    return {
      city: address.city,
      country: address.country,
      line1: address.line1,
      line2: address.line2,
      postalCode: address.postal_code,
      state: address.state
    };
  }

  private customerToDto(customer: Stripe.Customer): CustomerDto {
    return {
      id: customer.id,
      object: customer.object,
      address: this.addressToDto(customer.address),
      balance: customer.balance,
      created: customer.created,
      currency: customer.currency,
      defaultSource: customer.default_source as string | null,
      delinquent: customer.delinquent,
      description: customer.description,
      discount: customer.discount,
      email: customer.email,
      invoicePrefix: customer.invoice_prefix,
      invoiceSettings: customer.invoice_settings ? {
        customFields: customer.invoice_settings.custom_fields,
        defaultPaymentMethod: customer.invoice_settings.default_payment_method,
        footer: customer.invoice_settings.footer
      } : null,
      liveMode: customer.livemode,
      metadata: customer.metadata,
      name: customer.name,
      nextInvoiceSequence: customer.next_invoice_sequence,
      phone: customer.phone,
      preferredLocales: customer.preferred_locales
    }
  }

  private subscriptionToDto(subscription: Stripe.Subscription): SubscriptionDto {
    const latestInvoice = this.getIdOrDtoFieldValue(
      subscription.latest_invoice,
      v => this.invoiceToDto(v)
    );
    const defaultPaymentMethod = this.getIdOrDtoFieldValue(
      subscription.default_payment_method,
      v => this.paymentMethodToDto(v)
    );
    return {
      id: subscription.id,
      created: subscription.created,
      applicationFeePercent: subscription.application_fee_percent,
      automaticTaxEnabled: subscription.automatic_tax?.enabled || false,
      billingThresholds: {
        amountGte: subscription.billing_thresholds?.amount_gte,
        resetBillingCycleAnchor: subscription.billing_thresholds?.reset_billing_cycle_anchor
      },
      billingCycleAnchor: subscription.billing_cycle_anchor,
      cancelAt: subscription.cancel_at,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      collectionMethod: subscription.collection_method,
      currency: subscription.currency,
      canceledAt: subscription.canceled_at,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      customer: subscription.customer,
      daysUntilDue: subscription.days_until_due,
      defaultPaymentMethod,
      defaultSource: subscription.default_source,
      defaultTaxRates: subscription.default_tax_rates as unknown as TaxRate[],
      description: subscription.description,
      discount: subscription.discount,
      endedAt: subscription.ended_at,
      items: subscription.items.data.map(i => this.subscriptionItemToDto(i)),
      latestInvoice,
      liveMode: subscription.livemode,
      metadata: subscription.metadata,
      nextPendingInvoiceItemInvoice: subscription.next_pending_invoice_item_invoice,
      object: subscription.object,
      pauseCollection: subscription.pause_collection,
      paymentSettings: subscription.payment_settings,
      pendingInvoiceItemInterval: subscription.pending_invoice_item_interval,
      pendingSetupIntent: subscription.pending_setup_intent,
      pendingUpdate: subscription.pending_update,
      schedule: subscription.schedule,
      startDate: subscription.start_date,
      status: subscription.status,
      testClock: subscription.test_clock,
      transferData: subscription.transfer_data,
      trialEnd: subscription.trial_end,
      trialStart: subscription.trial_start
    };
  }

  private invoiceLineItemToDto(item: Stripe.InvoiceLineItem): InvoiceLineItemDto {
    if (!item) {
      return item as undefined | null;
    }
    return {
      id: item.id,
      object: item.object,
      amount: item.amount,
      amountExcludingTax: item.amount_excluding_tax,
      currency: item.currency,
      description: item.description,
      discountAmounts: item.discount_amounts,
      discountable: item.discountable,
      discounts: item.discounts,
      invoiceItem: item.invoice_item as string,
      liveMode: item.livemode,
      metadata: item.metadata,
      period: item.period,
      plan: item.plan ? this.planToDto(item.plan) : null,
      price: item.price ? this.priceToDto(item.price) : null,
      proration: item.proration,
      prorationDetails: item.proration_details ? {
        creditedItems: item.proration_details.credited_items ? {
          invoice: item.proration_details.credited_items.invoice,
          invoiceLineItems: item.proration_details.credited_items.invoice_line_items
        } : undefined
      } : null,
      quantity: item.quantity,
      subscription: item.subscription as string,
      subscriptionItem: stripeObjId(item.subscription_item),
      taxAmounts: item.tax_amounts?.map(t => ({
        amount: t.amount,
        inclusive: t.inclusive,
        taxRate: t.tax_rate
      })),
      taxRates: item.tax_rates,
      type: item.type,
      unitAmountExcludingTax: item.unit_amount_excluding_tax
    }
  }

  private quoteToDto(quote: Stripe.Quote): QuoteDto {
    return {
      id: quote.id,
      object: quote.object,
      amountSubtotal: quote.amount_subtotal,
      amountTotal: quote.amount_total,
      application: quote.application,
      applicationFeeAmount: quote.application_fee_amount,
      applicationFeePercent: quote.application_fee_percent,
      automaticTax: quote.automatic_tax,
      collectionMethod: quote.collection_method,
      computed: quote.computed,
      created: quote.created,
      currency: quote.currency,
      customer: quote.customer,
      description: quote.description,
      defaultRaxRates: quote.default_tax_rates,
      discounts: quote.discounts,
      expiresAt: quote.expires_at,
      footer: quote.footer,
      header: quote.header,
      invoice: quote.invoice as string,
      invoiceSettings: quote.invoice_settings ? {
        daysUntilDue: quote.invoice_settings.days_until_due
      } : undefined,
      lineItems: quote.line_items?.data,
      liveMode: quote.livemode,
      metadata: quote.metadata,
      number: quote.number,
      onBehalfOf: quote.on_behalf_of,
      status: quote.status,
      statusTransitions: quote.status_transitions ? {
        acceptedAt: quote.status_transitions.accepted_at,
        canceledAt: quote.status_transitions.canceled_at,
        finalizedAt: quote.status_transitions.finalized_at
      } : null,
      subscription: quote.subscription as string,
      subscriptionData: quote.subscription_data ? {
        effectiveDate: quote.subscription_data.effective_date,
        trialPeriodDays: quote.subscription_data.trial_period_days
      } : null,
      subscriptionSchedule: quote.subscription_schedule
    }
  }

  private invoiceToDto(invoice: Stripe.Invoice): InvoiceDto {
    const subscription = this.getIdOrDtoFieldValue(
      invoice.subscription,
      v => this.subscriptionToDto(v)
    );
    const quote = this.getIdOrDtoFieldValue(
      invoice.quote,
      v => this.quoteToDto(v)
    );
    return {
      id: invoice.id,
      accountCountry: invoice.account_country,
      accountName: invoice.account_name,
      accountTaxIds: invoice.account_tax_ids,
      amountDue: invoice.amount_due,
      amountPaid: invoice.amount_paid,
      amountRemaining: invoice.amount_remaining,
      application: invoice.application,
      applicationFeeAmount: invoice.application_fee_amount,
      attemptCount: invoice.attempt_count,
      attempted: invoice.attempted,
      autoAdvance: invoice.auto_advance,
      automaticTax: invoice.automatic_tax,
      billingReason: invoice.billing_reason,
      charge: invoice.charge,
      collectionMethod: invoice.collection_method,
      created: invoice.created,
      currency: invoice.currency,
      customer: invoice.customer,
      customFields: invoice.custom_fields,
      customerAddress: this.addressToDto(invoice.customer_address),
      customerEmail: invoice.customer_email,
      customerName: invoice.customer_name,
      customerPhone: invoice.customer_phone,
      customerShipping: invoice.customer_shipping ? {
        address: this.addressToDto(invoice.customer_shipping.address),
        carrier: invoice.customer_shipping.carrier,
        name: invoice.customer_shipping.name,
        phone: invoice.customer_shipping.phone,
        trackingNumber: invoice.customer_shipping.tracking_number
      } : undefined,
      customerTaxExempt: invoice.customer_tax_exempt,
      customerTaxIds: invoice.customer_tax_ids,
      defaultPaymentMethod: invoice.default_payment_method,
      defaultSource: invoice.default_source,
      defaultTaxRates: invoice.default_tax_rates,
      description: invoice.description,
      discount: invoice.discount,
      discounts: invoice.discounts,
      dueDate: invoice.due_date,
      endingBalance: invoice.ending_balance,
      footer: invoice.footer,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdf: invoice.invoice_pdf,
      lastFinalizationError: invoice.last_finalization_error,
      lines: invoice.lines?.data?.map(i => this.invoiceLineItemToDto(i)),
      liveMode: invoice.livemode,
      metadata: invoice.metadata,
      nextPaymentAttempt: invoice.next_payment_attempt,
      number: invoice.number,
      onBehalfOf: invoice.on_behalf_of,
      object: invoice.object,
      paid: invoice.paid,
      paidOutOfBand: invoice.paid_out_of_band,
      paymentIntent: invoice.payment_intent,
      paymentSettings: invoice.payment_settings ? {
        paymentMethodOptions: {
          acssDebit: invoice.payment_settings.payment_method_options?.acss_debit,
          bancontact: invoice.payment_settings.payment_method_options?.bancontact,
          card: invoice.payment_settings.payment_method_options?.card,
          customerBalance: invoice.payment_settings.payment_method_options?.customer_balance,
          konbini: invoice.payment_settings.payment_method_options?.konbini,
          usBankAccount: invoice.payment_settings.payment_method_options?.us_bank_account
        },
        paymentMethodTypes: invoice.payment_settings.payment_method_types
      } : undefined,
      periodEnd: invoice.period_end,
      periodStart: invoice.period_start,
      postPaymentCreditNotesAmount: invoice.post_payment_credit_notes_amount,
      prePaymentCreditNotesAmount: invoice.pre_payment_credit_notes_amount,
      quote,
      receiptNumber: invoice.receipt_number,
      renderingOptions: invoice.rendering_options ? {
        amountTaxDisplay: invoice.rendering_options.amount_tax_display
      } : null,
      startingBalance: invoice.starting_balance,
      statementDescriptor: invoice.statement_descriptor,
      status: invoice.status,
      statusTransitions: invoice.status_transitions ? {
        finalizedAt: invoice.status_transitions.finalized_at,
        markedUncollectibleAt: invoice.status_transitions.marked_uncollectible_at,
        paidAt: invoice.status_transitions.paid_at,
        voidedAt: invoice.status_transitions.voided_at
      } : null,
      subscription,
      subtotal: invoice.subtotal,
      subtotalExcludingTax: invoice.subtotal_excluding_tax,
      subscriptionProrationDate: invoice.subscription_proration_date,
      tax: invoice.tax,
      testClock: invoice.test_clock,
      thresholdReason: invoice.threshold_reason ? {
        amountGte: invoice.threshold_reason.amount_gte,
        itemReasons: invoice.threshold_reason.item_reasons?.map(i => ({
          lineItemIds: i.line_item_ids,
          usageGte: i.usage_gte
        }))
      } : null,
      total: invoice.total,
      totalDiscountAmounts: invoice.total_discount_amounts,
      totalExcludingTax: invoice.total_excluding_tax,
      totalTaxAmounts: invoice.total_tax_amounts?.map(i => ({
        amount: i.amount,
        inclusive: i.inclusive,
        taxRate: i.tax_rate
      })),
      transferData: invoice.transfer_data,
      webhooksDeliveredAt: invoice.webhooks_delivered_at
    };
  }

  private upcomingInvoiceToDto(invoice: Stripe.UpcomingInvoice): UpcomingInvoiceDto {
    const subscription = this.getIdOrDtoFieldValue(
      invoice.subscription,
      v => this.subscriptionToDto(v)
    );
    const quote = this.getIdOrDtoFieldValue(
      invoice.quote,
      v => this.quoteToDto(v)
    );
    return {
      accountCountry: invoice.account_country,
      accountName: invoice.account_name,
      accountTaxIds: invoice.account_tax_ids,
      amountDue: invoice.amount_due,
      amountPaid: invoice.amount_paid,
      amountRemaining: invoice.amount_remaining,
      application: invoice.application,
      applicationFeeAmount: invoice.application_fee_amount,
      attemptCount: invoice.attempt_count,
      attempted: invoice.attempted,
      autoAdvance: invoice.auto_advance,
      automaticTax: invoice.automatic_tax,
      billingReason: invoice.billing_reason,
      charge: invoice.charge,
      collectionMethod: invoice.collection_method,
      created: invoice.created,
      currency: invoice.currency,
      customer: invoice.customer,
      customFields: invoice.custom_fields,
      customerAddress: this.addressToDto(invoice.customer_address),
      customerEmail: invoice.customer_email,
      customerName: invoice.customer_name,
      customerPhone: invoice.customer_phone,
      customerShipping: invoice.customer_shipping ? {
        address: this.addressToDto(invoice.customer_shipping.address),
        carrier: invoice.customer_shipping.carrier,
        name: invoice.customer_shipping.name,
        phone: invoice.customer_shipping.phone,
        trackingNumber: invoice.customer_shipping.tracking_number
      } : undefined,
      customerTaxExempt: invoice.customer_tax_exempt,
      customerTaxIds: invoice.customer_tax_ids,
      defaultPaymentMethod: invoice.default_payment_method,
      defaultSource: invoice.default_source,
      defaultTaxRates: invoice.default_tax_rates,
      description: invoice.description,
      discount: invoice.discount,
      discounts: invoice.discounts,
      dueDate: invoice.due_date,
      endingBalance: invoice.ending_balance,
      footer: invoice.footer,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdf: invoice.invoice_pdf,
      lastFinalizationError: invoice.last_finalization_error,
      lines: invoice.lines?.data?.map(i => this.invoiceLineItemToDto(i)),
      liveMode: invoice.livemode,
      metadata: invoice.metadata,
      nextPaymentAttempt: invoice.next_payment_attempt,
      number: invoice.number,
      onBehalfOf: invoice.on_behalf_of,
      object: invoice.object,
      paid: invoice.paid,
      paidOutOfBand: invoice.paid_out_of_band,
      paymentIntent: invoice.payment_intent,
      paymentSettings: invoice.payment_settings ? {
        paymentMethodOptions: {
          acssDebit: invoice.payment_settings.payment_method_options?.acss_debit,
          bancontact: invoice.payment_settings.payment_method_options?.bancontact,
          card: invoice.payment_settings.payment_method_options?.card,
          customerBalance: invoice.payment_settings.payment_method_options?.customer_balance,
          konbini: invoice.payment_settings.payment_method_options?.konbini,
          usBankAccount: invoice.payment_settings.payment_method_options?.us_bank_account
        },
        paymentMethodTypes: invoice.payment_settings.payment_method_types
      } : undefined,
      periodEnd: invoice.period_end,
      periodStart: invoice.period_start,
      postPaymentCreditNotesAmount: invoice.post_payment_credit_notes_amount,
      prePaymentCreditNotesAmount: invoice.pre_payment_credit_notes_amount,
      quote,
      receiptNumber: invoice.receipt_number,
      renderingOptions: invoice.rendering_options ? {
        amountTaxDisplay: invoice.rendering_options.amount_tax_display
      } : null,
      startingBalance: invoice.starting_balance,
      statementDescriptor: invoice.statement_descriptor,
      status: invoice.status,
      statusTransitions: invoice.status_transitions ? {
        finalizedAt: invoice.status_transitions.finalized_at,
        markedUncollectibleAt: invoice.status_transitions.marked_uncollectible_at,
        paidAt: invoice.status_transitions.paid_at,
        voidedAt: invoice.status_transitions.voided_at
      } : null,
      subscription,
      subtotal: invoice.subtotal,
      subtotalExcludingTax: invoice.subtotal_excluding_tax,
      subscriptionProrationDate: invoice.subscription_proration_date,
      tax: invoice.tax,
      testClock: invoice.test_clock,
      thresholdReason: invoice.threshold_reason ? {
        amountGte: invoice.threshold_reason.amount_gte,
        itemReasons: invoice.threshold_reason.item_reasons?.map(i => ({
          lineItemIds: i.line_item_ids,
          usageGte: i.usage_gte
        }))
      } : null,
      total: invoice.total,
      totalDiscountAmounts: invoice.total_discount_amounts,
      totalExcludingTax: invoice.total_excluding_tax,
      totalTaxAmounts: invoice.total_tax_amounts?.map(i => ({
        amount: i.amount,
        inclusive: i.inclusive,
        taxRate: i.tax_rate
      })),
      transferData: invoice.transfer_data,
      webhooksDeliveredAt: invoice.webhooks_delivered_at
    };
  }

  private usageRecordToDto(usageRecord: Stripe.UsageRecord): UsageRecordDto {
    return {
      id: usageRecord.id,
      liveMode: usageRecord.livemode,
      object: usageRecord.object,
      quantity: usageRecord.quantity,
      subscriptionItem: usageRecord.subscription_item,
      timestamp: usageRecord.timestamp
    }
  }

  private priceToDto(price: Stripe.Price): PriceDto {
    const product = this.getIdOrDtoFieldValue(
      price.product,
      v => this.productToDto(v)
    );
    return {
      id: price.id,
      object: price.object,
      active: price.active,
      billingScheme: price.billing_scheme,
      created: price.created,
      currency: price.currency,
      liveMode: price.livemode,
      lookupKey: price.lookup_key,
      metadata: price.metadata,
      nickname: price.nickname,
      product,
      recurring: price.recurring ? {
        aggregateUsage: price.recurring.aggregate_usage,
        interval: price.recurring.interval,
        intervalCount: price.recurring.interval_count,
        trialPeriodDays: price.recurring.trial_period_days,
        usageType: price.recurring.usage_type
      } : null,
      taxBehavior: price.tax_behavior,
      tiers: price.tiers ? price.tiers.map(t => ({
        flatAmount: t.flat_amount,
        flatAmountDecimal: t.flat_amount_decimal,
        unitAmount: t.unit_amount,
        unitAmountDecimal: t.unit_amount_decimal,
        upTo: t.up_to
      })) : undefined,
      tiersMode: price.tiers_mode,
      transformQuantity: price.transform_quantity,
      type: price.type,
      unitAmount: price.unit_amount,
      unitAmountDecimal: price.unit_amount_decimal
    }
  }

  private productToDto(product: Stripe.Product): ProductDto {
    const defaultPrice = this.getIdOrDtoFieldValue(
      product.default_price,
      v => this.priceToDto(v)
    );
    return {
      id: product.id,
      object: product.object,
      active: product.active,
      attributes: product.attributes,
      caption: product.caption,
      created: product.created,
      deactivateOn: product.deactivate_on,
      description: product.description,
      defaultPrice,
      images: product.images,
      liveMode: product.livemode,
      metadata: product.metadata,
      name: product.name,
      packageDimensions: product.package_dimensions,
      shippable: product.shippable,
      statementDescriptor: product.statement_descriptor,
      taxCode: product.tax_code,
      type: product.type,
      unitLabel: product.unit_label,
      updated: product.updated,
      url: product.url
    }
  }

  private planToDto(plan: Stripe.Plan): PlanDto {
    const product = this.getIdOrDtoFieldValue(
      plan.product,
      v => this.productToDto(v)
    );
    return {
      id: plan.id,
      object: plan.object,
      active: plan.active,
      aggregateUsage: plan.aggregate_usage,
      amount: plan.amount,
      amountDecimal: plan.amount_decimal,
      billingScheme: plan.billing_scheme,
      created: plan.created,
      currency: plan.currency,
      interval: plan.interval,
      intervalCount: plan.interval_count,
      liveMode: plan.livemode,
      metadata: plan.metadata,
      nickname: plan.nickname,
      product,
      tiers: plan.tiers,
      tiersMode: plan.tiers_mode,
      transformUsage: plan.transform_usage,
      trialPeriodDays: plan.trial_period_days,
      usageType: plan.usage_type
    }
  }

  private subscriptionItemToDto(item: Stripe.SubscriptionItem): SubscriptionItemDto {
    return {
      id: item.id,
      object: item.object,
      billingThresholds: item.billing_thresholds,
      created: item.created,
      metadata: item.metadata,
      plan: item.plan && this.planToDto(item.plan),
      price: item.price && this.priceToDto(item.price),
      quantity: item.quantity,
      subscription: item.subscription,
      taxRates: item.tax_rates
    }
  }

  private subscriptionScheduleToDto(item: Stripe.SubscriptionSchedule): SubscriptionScheduleDto {
    return {
      id: item.id,
      object: item.object,
      created: item.created,
      metadata: item.metadata,
      canceledAt: item.canceled_at,
      completedAt: item.completed_at,
      currentPhase: item.current_phase ? {
        end: item.current_phase.end_date,
        start: item.current_phase.start_date
      } : undefined,
      customerId: stripeObjId(item.customer),
      endBehavior: item.end_behavior,
      releasedAt: item.released_at,
      releasedSubscriptionId: item.released_subscription,
      status: item.status,
      subscriptionId: stripeObjId(item.subscription),
      phases: item.phases?.map(p => ({
        billingCycleAnchor: p.billing_cycle_anchor,
        currency: p.currency,
        defaultPaymentMethod: p.default_payment_method,
        description: p.description,
        endDate: p.end_date,
        items: p.items?.map(i => ({
          planId: stripeObjId(i.plan),
          priceId: stripeObjId(i.price),
          quantity: i.quantity
        })),
        prorationBehavior: p.proration_behavior,
        startDate: p.start_date,
      } as SchedulePhaseDto))
    }
  }

  private paymentIntentToDto(pi: Stripe.PaymentIntent): PaymentIntentDto {
    return {
      id: pi.id,
      object: pi.object,
      amount: pi.amount,
      amountCapturable: pi.amount_capturable,
      amountTip: pi.amount_details?.tip?.amount,
      amountReceived: pi.amount_received,
      application: pi.application as string,
      applicationFeeAmount: pi.application_fee_amount,
      automaticPaymentMethodsEnabled: pi.automatic_payment_methods?.enabled,
      canceledAt: pi.canceled_at,
      cancellationReason: pi.cancellation_reason,
      captureMethod: pi.capture_method,
      clientSecret: pi.client_secret,
      confirmationMethod: pi.confirmation_method,
      currency: pi.currency,
      customer: pi.customer as string | null,
      created: pi.created,
      description: pi.description,
      invoice: pi.invoice as string | null,
      lastPaymentError: pi.last_payment_error,
      liveMode: pi.livemode,
      metadata: pi.metadata,
      nextAction: pi.next_action,
      onBehalfOf: pi.on_behalf_of,
      paymentMethod: pi.payment_method as string | null,
      paymentMethodOptions: pi.payment_method_options,
      paymentMethodTypes: pi.payment_method_types,
      processing: pi.processing,
      receiptEmail: pi.receipt_email,
      review: pi.review as string | null,
      setupFutureUsage: pi.setup_future_usage,
      shipping: pi.shipping ? {
        address: pi.shipping.address ? this.addressToDto(pi.shipping.address) : null,
        carrier: pi.shipping.carrier,
        name: pi.shipping.name,
        phone: pi.shipping.phone,
        trackingNumber: pi.shipping.tracking_number
      } : null,
      statementDescriptor: pi.statement_descriptor,
      statementDescriptorSuffix: pi.statement_descriptor_suffix,
      status: pi.status,
    };
  }

  private paymentMethodToDto(pm: Stripe.PaymentMethod): PaymentMethodDto {
    return {
      id: pm.id,
      object: pm.object,
      acssDebit: pm.acss_debit ? {
        bankName: pm.acss_debit.bank_name,
        fingerprint: pm.acss_debit.fingerprint,
        institutionNumber: pm.acss_debit.institution_number,
        last4: pm.acss_debit.last4,
        transitNumber: pm.acss_debit.transit_number
      } : null,
      affirm: pm.affirm,
      afterPayClearPay: pm.afterpay_clearpay,
      aliPay: pm.alipay,
      auBecsDebit: pm.au_becs_debit ? {
        bsbNumber: pm.au_becs_debit.bsb_number,
        fingerprint: pm.au_becs_debit.fingerprint,
        last4: pm.au_becs_debit.last4
      } : null,
      bacsDebit: pm.bacs_debit ? {
        fingerprint: pm.bacs_debit.fingerprint,
        last4: pm.bacs_debit.last4,
        sortCode: pm.bacs_debit.sort_code
      } : null,
      banContact: pm.bancontact,
      billingDetails: pm.billing_details ? {
        address: this.addressToDto(pm.billing_details.address),
        email: pm.billing_details.email,
        name: pm.billing_details.name,
        phone: pm.billing_details.phone,
      } : null,
      boleTo: pm.boleto ? { taxId: pm.boleto.tax_id } : null,
      card: pm.card ? {
        brand: pm.card.brand,
        checks: pm.card.checks ? {
          addressLine1Check: pm.card.checks.address_line1_check,
          addressPostalCodeCheck: pm.card.checks.address_postal_code_check,
          cvcCheck: pm.card.checks.cvc_check
        } : null,
        country: pm.card.country,
        description: pm.card.description,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year,
        fingerprint: pm.card.fingerprint,
        funding: pm.card.funding,
        last4: pm.card.last4,
        networks: pm.card.networks,
        threeDSecureUsageSupported: pm.card.three_d_secure_usage? pm.card.three_d_secure_usage.supported : null,
        wallet: pm.card.wallet ? {
          amexExpressCheckout: pm.card.wallet.amex_express_checkout,
          applePay: pm.card.wallet.apple_pay,
          dynamicLast4: pm.card.wallet.dynamic_last4,
          googlePay: pm.card.wallet.google_pay,
          masterPass: pm.card.wallet.masterpass ? {
            billingAddress: this.addressToDto(pm.card.wallet.masterpass.billing_address),
            email: pm.card.wallet.masterpass.email,
            name: pm.card.wallet.masterpass.name,
            shippingAddress: this.addressToDto(pm.card.wallet.masterpass.shipping_address)
          } : null,
          samsungPay: pm.card.wallet.samsung_pay,
          type: pm.card.wallet.type,
          visaCheckout: pm.card.wallet.visa_checkout ? {
            billingAddress: this.addressToDto(pm.card.wallet.visa_checkout.billing_address),
            email: pm.card.wallet.visa_checkout.email,
            name: pm.card.wallet.visa_checkout.name,
            shippingAddress: this.addressToDto(pm.card.wallet.visa_checkout.shipping_address)
          } : null
        } : null
      } : null,
      cardPresent: pm.card_present,
      created: pm.created,
      customer: pm.customer as string | null,
      epsBank: pm.eps?.bank,
      fpx: pm.fpx ? {
        accountHolderType: pm.fpx.account_holder_type,
        bank: pm.fpx.bank
      } : null,
      giroPay: pm.giropay,
      grabPay: pm.grabpay,
      ideal: pm.ideal,
      interacPresent: pm.interac_present,
      klarnaDob: pm.klarna?.dob,
      konbini: pm.konbini,
      link: pm.link ? {
        email: pm.link.email,
        persistentToken: pm.link.persistent_token
      } : null,
      liveMode: pm.livemode,
      metadata: pm.metadata,
      oxxo: pm.oxxo,
      p24Bank: pm.p24?.bank,
      payNow: pm.paynow,
      promptPay: pm.promptpay,
      radarSession: pm.radar_options?.session,
      sepaDebit: pm.sepa_debit ? {
        bankCode: pm.sepa_debit.bank_code,
        branchCode: pm.sepa_debit.branch_code,
        country: pm.sepa_debit.country,
        fingerprint: pm.sepa_debit.fingerprint,
        generatedFrom: pm.sepa_debit.generated_from ? {
          charge: pm.sepa_debit.generated_from.charge as string,
          setupAttempt: pm.sepa_debit.generated_from.setup_attempt as string
        } : null,
        last4: pm.sepa_debit.last4
      } : null,
      sofortCountry: pm.sofort?.country,
      type: pm.type,
      usBankAccount: pm.us_bank_account ? {
        accountHolderType: pm.us_bank_account.account_holder_type,
        accountType: pm.us_bank_account.account_type,
        bankName: pm.us_bank_account.bank_name,
        financialConnectionsAccount: pm.us_bank_account.financial_connections_account,
        fingerprint: pm.us_bank_account.fingerprint,
        last4: pm.us_bank_account.last4,
        networks: pm.us_bank_account.networks,
        routingNumber: pm.us_bank_account.routing_number
      } : null,
      wechatPay: pm.wechat_pay
    }
  }

  private webhookEndpointToDto(we: Stripe.WebhookEndpoint): WebhookEndpointDto {
    return {
      id: we.id,
      object: we.object,
      apiVersion: we.api_version,
      application: we.application,
      created: we.created,
      description: we.description,
      enabledEvents: we.enabled_events,
      liveMode: we.livemode,
      metadata: we.metadata,
      secret: we.secret,
      status: we.status,
      url: we.url
    }
  }
  //#endregion

  private addressFromDto(dto: AddressDto): Stripe.Address {
    return dto ? {
      city: dto.city,
      country: dto.country,
      line1: dto.line1,
      line2: dto.line2,
      postal_code: dto.postalCode,
      state: dto.state
    } : undefined;
  }
}


function stripeObjId(obj: {id: string} | string): string {
  return typeof obj === 'string' ? obj : obj?.id || (obj as unknown as string);
}