import { ApiProperty } from '@nestjs/swagger';
import Stripe from 'stripe';
import { BaseDto } from '../base.dto';
import { InvoiceDto } from './invoice.dto';
import { PaymentMethodDto } from './payment-method.dto';
import { SubscriptionItemDto } from './subscription-item.dto';

export type TaxRate = 'gst' | 'hst' | 'jct' | 'pst' | 'qst' | 'rst' | 'sales_tax' | 'vat';

export class SubscriptionDto extends BaseDto {

  @ApiProperty()
  applicationFeePercent: number | null;

  @ApiProperty()
  automaticTaxEnabled: boolean;

  @ApiProperty()
  billingCycleAnchor: number;

  @ApiProperty()
  billingThresholds: {
    amountGte: number | null;
    resetBillingCycleAnchor: boolean | null;
  } | null;

  @ApiProperty()
  cancelAt: number | null;

  @ApiProperty()
  cancelAtPeriodEnd: boolean;

  @ApiProperty()
  canceledAt: number | null;

  @ApiProperty({
    enum: ['charge_automatically', 'send_invoice']
  })
  collectionMethod: 'charge_automatically' | 'send_invoice';

  @ApiProperty()
  currency?: string;

  @ApiProperty()
  currentPeriodStart: number;

  @ApiProperty()
  currentPeriodEnd: number;

  @ApiProperty()
  customer: string | Stripe.Customer | Stripe.DeletedCustomer;

  @ApiProperty()
  daysUntilDue: number | null;

  @ApiProperty()
  defaultPaymentMethod: string | PaymentMethodDto;
  
  @ApiProperty()
  defaultSource: string | Stripe.CustomerSource | null;

  @ApiProperty({ enum: ['gst', 'hst', 'jct', 'pst', 'qst', 'rst', 'sales_tax', 'vat']})
  defaultTaxRates: Array<TaxRate> | null;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  discount: Stripe.Discount | null;

  @ApiProperty()
  endedAt: number | null;

  @ApiProperty({ type: SubscriptionItemDto, isArray: true })
  items: SubscriptionItemDto[];

  @ApiProperty()
  latestInvoice: string | InvoiceDto | null;

  @ApiProperty()
  nextPendingInvoiceItemInvoice: number | null;

  @ApiProperty()
  pauseCollection: Stripe.Subscription.PauseCollection | null;

  @ApiProperty()
  paymentSettings: Stripe.Subscription.PaymentSettings | null;

  @ApiProperty()
  pendingInvoiceItemInterval: Stripe.Subscription.PendingInvoiceItemInterval | null;

  @ApiProperty()
  pendingSetupIntent: string | Stripe.SetupIntent | null;

  @ApiProperty()
  pendingUpdate: Stripe.Subscription.PendingUpdate | null;

  @ApiProperty()
  schedule: string | Stripe.SubscriptionSchedule | null;

  @ApiProperty()
  startDate: number;

  @ApiProperty({
    description: 'Possible values are `incomplete`, `incomplete_expired`, `trialing, active, past_due, canceled, or unpaid`.'
      + '\nFor `collection_method=charge_automatically` a subscription moves into `incomplete` if the initial payment attempt fails. A subscription in this state can only have metadata and default_source updated. Once the first invoice is paid, the subscription moves into an `active` state. If the first invoice is not paid within 23 hours, the subscription transitions to `incomplete_expired`. This is a terminal state, the open invoice will be voided and no further invoices will be generated.'
      + '\nA subscription that is currently in a trial period is `trialing` and moves to `active` when the trial period is over.'
      + '\nIf subscription `collection_method=charge_automatically` it becomes `past_due` when payment to renew it fails and `canceled` or `unpaid` (depending on your subscriptions settings) when Stripe has exhausted all payment retry attempts.'
      + '\nIf subscription `collection_method=send_invoice` it becomes `past_due` when its invoice is not paid by the due date, and `canceled` or `unpaid` if it is still not paid by an additional deadline after that. Note that when a subscription has a status of `unpaid`, no subsequent invoices will be attempted (invoices will be created, but then immediately automatically closed). After receiving updated payment information from a customer, you may choose to reopen and pay their closed invoices.'
    ,
    enum: ['incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid']
  })
  status: Stripe.Subscription.Status;

  @ApiProperty()
  testClock: string | Stripe.TestHelpers.TestClock | null;

  @ApiProperty()
  transferData: Stripe.Subscription.TransferData | null;

  @ApiProperty()
  trialEnd: number | null;

  @ApiProperty()
  trialStart: number | null;

}
