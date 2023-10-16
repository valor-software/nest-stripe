import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min
} from 'class-validator';
import Stripe from 'stripe';
import { CreateAutomaticTaxDto } from './shared.dto';

const PaymentMethodTypes = [
  'ach_credit_transfer'
  , 'ach_debit'
  , 'acss_debit'
  , 'au_becs_debit'
  , 'bacs_debit'
  , 'bancontact'
  , 'boleto'
  , 'card'
  , 'customer_balance'
  , 'fpx'
  , 'giropay'
  , 'grabpay'
  , 'ideal'
  , 'konbini'
  , 'link'
  , 'paynow'
  , 'promptpay'
  , 'sepa_credit_transfer'
  , 'sepa_debit'
  , 'sofort'
  , 'us_bank_account'
  , 'wechat_pay'
]

export class SubscriptionUpdateItemDto {

  @ApiPropertyOptional({ description: 'Subscription item to update.' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  planId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  quantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  deleted?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metadata?: Stripe.MetadataParam;
}

export class SubscriptionUpdateBillingThresholdsDto {
  @ApiPropertyOptional({
    description: 'Monetary threshold that triggers the subscription to advance to a new billing period'
  })
  @IsOptional()
  @IsNumber()
  amountGte?: number;

  @ApiPropertyOptional({
    description: 'Indicates if the `billing_cycle_anchor` should be reset when a threshold is reached. If true, `billing_cycle_anchor` will be updated to the date/time the threshold was last reached; otherwise, the value will remain unchanged.'
  })
  @IsOptional()
  @IsBoolean()
  resetBillingCycleAnchor?: boolean;
}

export class UpdateInvoiceItemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priceId?: string;

  @ApiPropertyOptional({ default: 1})
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @ApiPropertyOptional({
    description: 'The tax rates which apply to the item. When set, the `default_tax_rates` do not apply to this item.',
    isArray: true,
    type: String
  })
  @IsOptional()
  @IsString({ each: true })
  taxRates?: Array<string>;
}

export class SubscriptionUpdateMandateOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({
    description: 'One of `fixed` or `maximum`. If `fixed`, the `amount` param refers to the exact amount to be charged in future payments. If `maximum`, the amount charged can be up to the value passed for the `amount` param.',
    enum: ['fixed', 'maximum']
  })
  @IsOptional()
  @IsEnum(['fixed', 'maximum'])
  amountType?: 'fixed' | 'maximum';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class SubscriptionUpdateCardDto {
  @ApiPropertyOptional({
    description: 'Configuration options for setting up an eMandate for cards issued in India.'
  })
  mandateOptions?: SubscriptionUpdateMandateOptionsDto;

  @ApiPropertyOptional({
    description: 'We strongly recommend that you rely on our SCA Engine to automatically prompt your customers for authentication based on risk level and [other requirements](https://stripe.com/docs/strong-customer-authentication). However, if you wish to request 3D Secure based on logic from your own fraud engine, provide this option. Read our guide on [manually requesting 3D Secure](https://stripe.com/docs/payments/3d-secure#manual-three-ds) for more information on how this configuration interacts with Radar and our SCA Engine.',
    enum: ['any', 'automatic']
  })
  @IsOptional()
  @IsEnum(['any', 'automatic'])
  requestThreeDSecure?: Stripe.SubscriptionUpdateParams.PaymentSettings.PaymentMethodOptions.Card.RequestThreeDSecure;
}

export class SubscriptionUpdateUsBankAccountDto {

  @ApiPropertyOptional({
    description: 'Additional fields for Financial Connections Session creation',
    isArray: true,
    enum: ['balances', 'ownership', 'payment_method', 'transactions']
  })
  @IsOptional()
  @IsEnum(['balances', 'ownership', 'payment_method', 'transactions'])
  financialConnections?: Array<Stripe.SubscriptionUpdateParams.PaymentSettings.PaymentMethodOptions.UsBankAccount.FinancialConnections.Permission>;

  @ApiPropertyOptional({
    enum: ['automatic', 'instant', 'microdeposits']
  })
  @IsOptional()
  @IsEnum(['automatic', 'instant', 'microdeposits'])
  verificationMethod?: Stripe.SubscriptionUpdateParams.PaymentSettings.PaymentMethodOptions.UsBankAccount.VerificationMethod;
}

export class SubscriptionUpdatePaymentMethodOptionsDto {
  @ApiPropertyOptional({
    description: 'This sub-hash contains details about the Card payment method options to pass to the invoice\'s PaymentIntent.'
  })
  card?: SubscriptionUpdateCardDto;
  @ApiPropertyOptional({
    description: 'This sub-hash contains details about the ACH direct debit payment method options to pass to the invoice\'s PaymentIntent.'
  })
  usBankAccount?: SubscriptionUpdateUsBankAccountDto;
}

export class SubscriptionUpdatePaymentSettingsDto {
  @ApiPropertyOptional({
    description: 'Payment-method-specific configuration to provide to invoices created by the subscription.'
  })
  paymentMethodOptions?: SubscriptionUpdatePaymentMethodOptionsDto;

  @ApiPropertyOptional({
    description: 'The list of payment method types (e.g. card) to provide to the invoice\'s PaymentIntent. If not set, Stripe attempts to automatically determine the types to use by looking at the invoice\'s default payment method, the subscription\'s default payment method, the customer\'s default payment method, and your [invoice template settings](https://dashboard.stripe.com/settings/billing/invoice).',
    enum: PaymentMethodTypes
  })
  @IsOptional()
  @IsEnum(PaymentMethodTypes)
  paymentMethodTypes?: Array<Stripe.SubscriptionUpdateParams.PaymentSettings.PaymentMethodType>;

  @ApiPropertyOptional({
    description: 'Either `off`, or `on_subscription`. With `on_subscription` Stripe updates `subscription.default_payment_method` when a subscription payment succeeds.',
    enum: ['off', 'on_subscription']
  })
  @IsOptional()
  @IsEnum(['off', 'on_subscription'])
  saveDefaultPaymentMethod?: Stripe.SubscriptionUpdateParams.PaymentSettings.SaveDefaultPaymentMethod;
}

export class UpdateSubscriptionDto {

  @ApiPropertyOptional({ required: true, isArray: true, type: SubscriptionUpdateItemDto })
  @IsOptional()
  @IsArray()
  items?: Array<SubscriptionUpdateItemDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  cancelAtPeriodEnd?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  defaultPaymentMethod?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metadata?: Stripe.MetadataParam;

  @ApiPropertyOptional({
    enum: ['allow_incomplete', 'default_incomplete', 'error_if_incomplete', 'pending_if_incomplete'],
    default: 'default_incomplete',
    description: 'Use `allow_incomplete` to create subscriptions with `status=incomplete` if the first invoice cannot be paid. Creating subscriptions with this status allows you to manage scenarios where additional user actions are needed to pay a subscription\'s invoice. For example, SCA regulation may require 3DS authentication to complete payment. See the [SCA Migration Guide](https://stripe.com/docs/billing/migration/strong-customer-authentication) for Billing to learn more. This is the default behavior.'
    + 'Use `default_incomplete` to create Subscriptions with `status=incomplete` when the first invoice requires payment, otherwise start as active. Subscriptions transition to `status=active` when successfully confirming the payment intent on the first invoice. This allows simpler management of scenarios where additional user actions are needed to pay a subscription\'s invoice. Such as failed payments, [SCA regulation](https://stripe.com/docs/billing/migration/strong-customer-authentication), or collecting a mandate for a bank debit payment method. If the payment intent is not confirmed within 23 hours subscriptions transition to `status=incomplete_expired`, which is a terminal state.'
    + 'Use `error_if_incomplete` if you want Stripe to return an HTTP 402 status code if a subscription\'s first invoice cannot be paid. For example, if a payment method requires 3DS authentication due to SCA regulation and further user action is needed, this parameter does not create a subscription and returns an error instead. This was the default behavior for API versions prior to 2019-03-14. See the [changelog](https://stripe.com/docs/upgrades#2019-03-14) to learn more.'
    + '`pending_if_incomplete` is only used with updates and cannot be passed when creating a subscription.'
  })
  paymentBehavior?: Stripe.SubscriptionUpdateParams.PaymentBehavior;

  @ApiPropertyOptional({
    description: 'A list of prices and quantities that will generate invoice items appended to the first invoice for this subscription. You may pass up to 20 items.',
    isArray: true,
    type: UpdateInvoiceItemDto
  })
  addInvoiceItems?: Array<UpdateInvoiceItemDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  applicationFeePercent?: number;

  @ApiPropertyOptional()
  automaticTax?: CreateAutomaticTaxDto;

  @ApiPropertyOptional({
    description: 'Either `now` or `unchanged`. Setting the value to `now` resets the subscription\'s billing cycle anchor to the current time (in UTC). For more information, see the billing cycle [documentation](https://stripe.com/docs/billing/subscriptions/billing-cycle).',
    enum: ['now', 'unchanged']
  })
  @IsOptional()
  @IsEnum(['now', 'unchanged'])
  billingCycleAnchor?: Stripe.SubscriptionUpdateParams.BillingCycleAnchor;

  @ApiPropertyOptional({
    description: 'Define thresholds at which an invoice will be sent, and the subscription advanced to a new billing period. Pass an empty string to remove previously-defined thresholds.'
  })
  billingThresholds?: SubscriptionUpdateBillingThresholdsDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  cancelAt?: number;

  @ApiPropertyOptional({
    enum: ['charge_automatically', 'send_invoice']
  })
  @IsOptional()
  @IsEnum(['charge_automatically', 'send_invoice'])
  collectionMethod?: Stripe.SubscriptionUpdateParams.CollectionMethod;

  @ApiPropertyOptional()
  couponId?: string;

  @ApiPropertyOptional({
    description: 'Number of days a customer has to pay invoices generated by this subscription. Valid only for subscriptions where `collection_method` is set to `send_invoice`.'
  })
  @IsOptional()
  @IsNumber()
  daysUntilDue?: number;

  @ApiPropertyOptional({
    description: 'ID of the default payment source for the subscription. It must belong to the customer associated with the subscription and be in a chargeable state. If `default_payment_method` is also set, `default_payment_method` will take precedence. If neither are set, invoices will use the customer\'s [invoice_settings.default_payment_method](https://stripe.com/docs/api/customers/object#customer_object-invoice_settings-default_payment_method) or [default_source](https://stripe.com/docs/api/customers/object#customer_object-default_source).'
  })
  defaultSource?: string;

  @ApiPropertyOptional({
    description: 'The tax rates that will apply to any subscription item that does not have `tax_rates` set. Invoices created will have their `default_tax_rates` populated from the subscription.',
    isArray: true,
    type: String
  })
  defaultTaxRates?: Array<string>;

  @ApiPropertyOptional({
    description: 'Indicates if a customer is on or off-session while an invoice payment is attempted.'
  })
  @IsOptional()
  @IsBoolean()
  offSession?: boolean;

  @ApiPropertyOptional({
    description: 'Payment settings to pass to invoices created by the subscription.'
  })
  paymentSettings?: SubscriptionUpdatePaymentSettingsDto;

  @ApiPropertyOptional({
    description: 'The API ID of a promotion code to apply to this subscription. A promotion code applied to a subscription will only affect invoices created for that particular subscription.'
  })
  @IsOptional()
  @IsString()
  promotionCode?: string;

  @ApiPropertyOptional({
    description: 'Unix timestamp representing the end of the trial period the customer will get before being charged for the first time. This will always overwrite any trials that might apply via a subscribed plan. If set, trial_end will override the default trial period of the plan the customer is being subscribed to. The special value `now` can be provided to end the customer\'s trial immediately. Can be at most two years from `billing_cycle_anchor`. See [Using trial periods on subscriptions](https://stripe.com/docs/billing/subscriptions/trials) to learn more.'
  })
  trialEnd?: 'now' | number;

  @ApiPropertyOptional({
    description: 'Indicates if a plan\'s `trial_period_days` should be applied to the subscription. Setting `trial_end` per subscription is preferred, and this defaults to `false`. Setting this flag to `true` together with `trial_end` is not allowed. See [Using trial periods on subscriptions](https://stripe.com/docs/billing/subscriptions/trials) to learn more.'
  })
  @IsOptional()
  @IsBoolean()
  trialFromPlan?: boolean;

  @ApiPropertyOptional({
    description: 'Integer representing the number of trial period days before the customer is charged for the first time. This will always overwrite any trials that might apply via a subscribed plan. See [Using trial periods on subscriptions](https://stripe.com/docs/billing/subscriptions/trials) to learn more.'
  })
  @IsOptional()
  @IsNumber()
  trialPeriodDays?: number;

  @ApiPropertyOptional({
    enum: ['always_invoice', 'create_prorations', 'none'],
    description: `Determines how to handle [prorations](https://stripe.com/docs/subscriptions/billing-cycle#prorations) when the billing cycle changes (e.g., when switching plans, resetting \`billing_cycle_anchor=now\`, or starting a trial), or if an item's \`quantity\` changes. The default value is \`create_prorations\`.`,
  })
  @IsOptional()
  @IsEnum(['always_invoice', 'create_prorations', 'none'])
  prorationBehavior?: Stripe.SubscriptionUpdateParams.ProrationBehavior;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  prorationDate?: Date;

}