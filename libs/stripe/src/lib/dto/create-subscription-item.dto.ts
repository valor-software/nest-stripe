import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import Stripe from 'stripe';

export class SubscriptionItemCreateBillingThresholdsDto {
  @ApiProperty({
    description: ' Usage threshold that triggers the subscription to advance to a new billing period',
  })
  @IsNumber()
  usageGte: number;
}

export class CreateSubscriptionItemDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  priceId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  planId: string;

  @ApiPropertyOptional()
  billingThresholds?: SubscriptionItemCreateBillingThresholdsDto;

  @ApiPropertyOptional()
  metadata?: Stripe.MetadataParam;

  @ApiPropertyOptional({
    description: [
        'Use `allow_incomplete` to transition the subscription to `status=past_due` if a payment is required but cannot be paid. This allows you to manage scenarios where additional user actions are needed to pay a subscription\'s invoice. For example, SCA regulation may require 3DS authentication to complete payment. See the [SCA Migration Guide](https://stripe.com/docs/billing/migration/strong-customer-authentication) for Billing to learn more. This is the default behavior.'
      , 'Use `default_incomplete` to transition the subscription to `status=past_due` when payment is required and await explicit confirmation of the invoice\'s payment intent. This allows simpler management of scenarios where additional user actions are needed to pay a subscription\'s invoice. Such as failed payments, [SCA regulation](https://stripe.com/docs/billing/migration/strong-customer-authentication), or collecting a mandate for a bank debit payment method.'
      , 'Use `pending_if_incomplete` to update the subscription using [pending updates](https://stripe.com/docs/billing/subscriptions/pending-updates). When you use `pending_if_incomplete` you can only pass the parameters [supported by pending updates](https://stripe.com/docs/billing/pending-updates-reference#supported-attributes).'
      , 'Use `error_if_incomplete` if you want Stripe to return an HTTP 402 status code if a subscription\'s invoice cannot be paid. For example, if a payment method requires 3DS authentication due to SCA regulation and further user action is needed, this parameter does not update the subscription and returns an error instead. This was the default behavior for API versions prior to 2019-03-14. See the [changelog](https://stripe.com/docs/upgrades#2019-03-14) to learn more.'
    ].join('\n'),
    enum: ['allow_incomplete', 'default_incomplete', 'error_if_incomplete', 'pending_if_incomplete']
  })
  paymentBehavior?: Stripe.SubscriptionItemCreateParams.PaymentBehavior;

  @ApiPropertyOptional({
    description: 'Determines how to handle [prorations](https://stripe.com/docs/subscriptions/billing-cycle#prorations) when the billing cycle changes (e.g., when switching plans, resetting `billing_cycle_anchor=now`, or starting a trial), or if an item\'s `quantity` changes.',
    enum: ['always_invoice', 'create_prorations', 'none']
  })
  prorationBehavior?: Stripe.SubscriptionItemCreateParams.ProrationBehavior;

  @ApiPropertyOptional({
    description: 'If set, the proration will be calculated as though the subscription was updated at the given time. This can be used to apply the same proration that was previewed with the [upcoming invoice](https://stripe.com/docs/api#retrieve_customer_invoice) endpoint.'
  })
  proration_date?: number;

  @ApiPropertyOptional()
  quantity?: number;

  @ApiPropertyOptional({
    isArray: true,
    type: String
  })
  taxRates?: Array<string>;
}