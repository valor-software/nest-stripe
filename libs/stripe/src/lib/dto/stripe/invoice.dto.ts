import { ApiProperty } from '@nestjs/swagger';
import Stripe from 'stripe';
import { BaseDto } from '../base.dto';
import { SubscriptionDto } from './subscription.dto';

export class InvoiceDto extends BaseDto {
  @ApiProperty()
  accountCountry: string | null;

  @ApiProperty()
  accountName: string | null;

  @ApiProperty()
  accountTaxIds: Array<string | Stripe.TaxId | Stripe.DeletedTaxId> | null;

  @ApiProperty()
  amountDue: number;

  @ApiProperty()
  amountPaid: number;

  @ApiProperty()
  amountRemaining: number;

  @ApiProperty()
  application: string | Stripe.Application | Stripe.DeletedApplication | null;

  @ApiProperty()
  applicationFeeAmount: number | null;

  @ApiProperty()
  attemptCount: number;

  @ApiProperty({
    description: 'Whether an attempt has been made to pay the invoice. An invoice is not attempted until 1 hour after the `invoice.created` webhook, for example, so you might not want to display that invoice as unpaid to your users.'
  })
  attempted: boolean;

  @ApiProperty({
    description: 'Controls whether Stripe will perform [automatic collection](https://stripe.com/docs/billing/invoices/workflow/#auto_advance) of the invoice. When `false`, the invoice\'s state will not automatically advance without an explicit action.'
  })
  autoAdvance: boolean;

  @ApiProperty()
  automaticTax: Stripe.Invoice.AutomaticTax;

  @ApiProperty()
  billingReason: Stripe.Invoice.BillingReason | null;

  @ApiProperty()
  charge: string | Stripe.Charge | null;

  @ApiProperty()
  collectionMethod: Stripe.Invoice.CollectionMethod;

  @ApiProperty()
  currency: string;

  @ApiProperty({ isArray: true })
  customFields: Array<Stripe.Invoice.CustomField> | null;

  @ApiProperty()
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null;

  @ApiProperty()
  customerAddress: Stripe.Address | null;

  @ApiProperty()
  customerEmail: string | null;

  @ApiProperty()
  customerName: string | null;

  @ApiProperty()
  customerPhone: string | null;

  @ApiProperty()
  customerShipping: Stripe.Invoice.CustomerShipping | null;

  @ApiProperty()
  customerTaxExempt: Stripe.Invoice.CustomerTaxExempt | null;

  @ApiProperty()
  customerTaxIds: Array<Stripe.Invoice.CustomerTaxId> | null;

  @ApiProperty()
  defaultPaymentMethod: string | Stripe.PaymentMethod | null;

  @ApiProperty()
  defaultSource: string | Stripe.CustomerSource | null;

  @ApiProperty()
  defaultTaxRates: Array<Stripe.TaxRate>;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  discount: Stripe.Discount | null;

  @ApiProperty()
  discounts: Array<string | Stripe.Discount | Stripe.DeletedDiscount> | null;

  @ApiProperty()
  dueDate: number | null;

  @ApiProperty()
  endingBalance: number | null;

  @ApiProperty()
  footer: string | null;

  @ApiProperty()
  hostedInvoiceUrl?: string | null;

  @ApiProperty()
  invoicePdf?: string | null;

  @ApiProperty()
  lastFinalizationError: Stripe.Invoice.LastFinalizationError | null;

  @ApiProperty()
  lines: Array<Stripe.InvoiceLineItem>;

  @ApiProperty()
  nextPaymentAttempt: number | null;

  @ApiProperty()
  number: string | null;

  @ApiProperty()
  onBehalfOf: string | Stripe.Account | null;

  @ApiProperty()
  paid: boolean;

  @ApiProperty()
  paidOutOfBand: boolean;

  @ApiProperty()
  paymentIntent: string | Stripe.PaymentIntent | null;

  @ApiProperty()
  paymentSettings: Stripe.Invoice.PaymentSettings;

  @ApiProperty()
  periodEnd: number;

  @ApiProperty()
  periodStart: number;

  @ApiProperty()
  postPaymentCreditNotesAmount: number;

  @ApiProperty()
  prePaymentCreditNotesAmount: number;

  @ApiProperty()
  quote: string | Stripe.Quote | null;

  @ApiProperty()
  receiptNumber: string | null;

  @ApiProperty()
  renderingOptions: Stripe.Invoice.RenderingOptions | null;

  @ApiProperty()
  startingBalance: number;

  @ApiProperty()
  statementDescriptor: string | null;

  @ApiProperty({ enum: ['deleted', 'draft', 'open', 'paid', 'uncollectible', 'void']})
  status: 'deleted' | 'draft' | 'open' | 'paid' | 'uncollectible' | 'void' | null;

  @ApiProperty()
  statusTransitions: Stripe.Invoice.StatusTransitions;

  @ApiProperty()
  subscription: string | SubscriptionDto | null;

  @ApiProperty()
  subscriptionProrationDate?: number;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  subtotalExcludingTax: number | null;

  @ApiProperty()
  tax: number | null;

  @ApiProperty()
  testClock: string | Stripe.TestHelpers.TestClock | null;

  @ApiProperty()
  thresholdReason?: Stripe.Invoice.ThresholdReason;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalDiscountAmounts: Array<Stripe.Invoice.TotalDiscountAmount> | null;

  @ApiProperty()
  totalExcludingTax: number | null;

  @ApiProperty()
  totalTaxAmounts: Array<Stripe.Invoice.TotalTaxAmount>;

  @ApiProperty()
  transferData: Stripe.Invoice.TransferData | null;

  @ApiProperty()
  webhooksDeliveredAt: number | null;

}
