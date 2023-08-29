import { ApiPropertyOptional } from '@nestjs/swagger';
import Stripe from 'stripe';
import { BaseResponse } from './base.response';

export class SubscriptionResponse extends BaseResponse {
  @ApiPropertyOptional()
  subscriptionId?: string;

  @ApiPropertyOptional()
  clientSecret?: string;

  @ApiPropertyOptional({
    enum: ['active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid']
  })
  status?: Stripe.Subscription.Status;

  @ApiPropertyOptional({
    enum: ['canceled', 'processing', 'requires_action', 'requires_capture', 'requires_confirmation', 'requires_payment_method', 'succeeded']
  })
  paymentIntentStatus?: Stripe.PaymentIntent.Status;

  @ApiPropertyOptional()
  latestInvoiceId?: string;

  @ApiPropertyOptional()
  paymentIntentId?: string;
}