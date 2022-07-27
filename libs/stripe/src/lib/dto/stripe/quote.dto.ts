import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Stripe from 'stripe';
import { BaseDto } from '../base.dto';
import { AutomaticTaxDto, TaxRates } from '../shared.dto';

export class QuoteInvoiceSettingsDto {
  @ApiProperty({
  description: 'Number of days within which a customer must pay invoices generated by this quote. This value will be `null` for quotes where `collection_method=charge_automatically`.'
  })
  daysUntilDue: number | null;
}

export class QuoteStatusTransitionsDto {

  @ApiProperty({
    description: 'The time that the quote was accepted. Measured in seconds since Unix epoch.'
  })
  acceptedAt: number | null;

  @ApiProperty({
    description: 'The time that the quote was canceled. Measured in seconds since Unix epoch.'
  })
  canceledAt: number | null;

  @ApiProperty({
    description: 'The time that the quote was finalized. Measured in seconds since Unix epoch.'
  })
  finalizedAt: number | null;
}

export class QuoteSubscriptionDataDto {

  @ApiProperty({
    description: 'When creating a new subscription, the date of which the subscription schedule will start after the quote is accepted. This date is ignored if it is in the past when the quote is accepted. Measured in seconds since the Unix epoch.'
  })
  effectiveDate: number | null;
  
  @ApiProperty({
    description: 'Integer representing the number of trial period days before the customer is charged for the first time.'
  })
  trialPeriodDays: number | null;
}

export class QuoteDto extends BaseDto {
  @ApiProperty({
    description: 'Total before any discounts or taxes are applied.'
  })
  amountSubtotal: number;

  @ApiProperty({
    description: 'Total after discounts and taxes are applied.'
  })
  amountTotal: number;

  @ApiProperty({
    description: 'ID of the Connect Application that created the quote.',
    type: 'string'
  })
  application: string | Stripe.Application | Stripe.DeletedApplication | null;

  @ApiProperty({
    description: 'The amount of the application fee (if any) that will be requested to be applied to the payment and transferred to the application owner\'s Stripe account. Only applicable if there are no line items with recurring prices on the quote.'
  })
  applicationFeeAmount: number | null;

  @ApiProperty()
  applicationFeePercent: number | null;

  @ApiProperty()
  automaticTax: AutomaticTaxDto;

  @ApiProperty({
    description: 'Either `charge_automatically`, or `send_invoice`. When charging automatically, Stripe will attempt to pay invoices at the end of the subscription cycle or on finalization using the default payment method attached to the subscription or customer. When sending an invoice, Stripe will email your customer an invoice with payment instructions. Defaults to `charge_automatically`.',
    enum:['charge_automatically', 'send_invoice']
  })
  collectionMethod: Stripe.Quote.CollectionMethod;

  @ApiProperty()
  computed: Stripe.Quote.Computed;
  
  @ApiProperty()
  currency: string | null;
  
  @ApiProperty({
    description: 'The customer which this quote belongs to. A customer is required before finalizing the quote. Once specified, it cannot be changed.'
  })
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null;

  @ApiProperty()
  description: string | null;

  @ApiPropertyOptional({ isArray: true, type: String, enum: TaxRates })
  defaultRaxRates?: Array<string | Stripe.TaxRate>;

  @ApiProperty({ isArray: true, type: String })
  discounts: Array<string | Stripe.Discount>;

  @ApiProperty()
  expiresAt: number;

  @ApiProperty()
  footer: string | null;

  @ApiProperty()
  header: string | null;

  @ApiProperty()
  invoice: string | null;

  @ApiProperty()
  invoiceSettings: QuoteInvoiceSettingsDto | null;

  @ApiProperty()
  lineItems?: Array<Stripe.LineItem>;
  
  @ApiProperty()
  number: string | null;
  
  @ApiProperty({
    description: 'The account on behalf of which to charge. See the [Connect documentation](https://support.stripe.com/questions/sending-invoices-on-behalf-of-connected-accounts) for details.'
  })
  onBehalfOf: string | Stripe.Account | null;

  @ApiProperty({
    enum: ['accepted', 'canceled', 'draft', 'open']
  })
  status: Stripe.Quote.Status;

  @ApiProperty()
  statusTransitions: QuoteStatusTransitionsDto;

  @ApiProperty()
  subscription: string | null;
  
  @ApiProperty()
  subscriptionData: QuoteSubscriptionDataDto;
  
  @ApiProperty()
  subscriptionSchedule: string | Stripe.SubscriptionSchedule | null;

}