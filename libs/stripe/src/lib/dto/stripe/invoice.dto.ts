import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Stripe from 'stripe';
import { BaseDto } from '../base.dto';
import { AddressDto, AutomaticTaxDto, CustomFieldDto, TaxAmountDto, TaxRates } from '../shared.dto';
import { InvoiceLineItemDto } from './invoice-line-item.dto';
import { QuoteDto } from './quote.dto';
import { SubscriptionDto } from './subscription.dto';

const BillingReasons = [
  'automatic_pending_invoice_item_invoice'
  , 'manual'
  , 'quote_accept'
  , 'subscription'
  , 'subscription_create'
  , 'subscription_cycle'
  , 'subscription_threshold'
  , 'subscription_update'
  , 'upcoming'
];

const CustomerTaxIdTypes = [
  'ae_trn'
  , 'au_abn'
  , 'au_arn'
  , 'bg_uic'
  , 'br_cnpj'
  , 'br_cpf'
  , 'ca_bn'
  , 'ca_gst_hst'
  , 'ca_pst_bc'
  , 'ca_pst_mb'
  , 'ca_pst_sk'
  , 'ca_qst'
  , 'ch_vat'
  , 'cl_tin'
  , 'es_cif'
  , 'eu_oss_vat'
  , 'eu_vat'
  , 'gb_vat'
  , 'ge_vat'
  , 'hk_br'
  , 'hu_tin'
  , 'id_npwp'
  , 'il_vat'
  , 'in_gst'
  , 'is_vat'
  , 'jp_cn'
  , 'jp_rn'
  , 'kr_brn'
  , 'li_uid'
  , 'mx_rfc'
  , 'my_frp'
  , 'my_itn'
  , 'my_sst'
  , 'no_vat'
  , 'nz_gst'
  , 'ru_inn'
  , 'ru_kpp'
  , 'sa_vat'
  , 'sg_gst'
  , 'sg_uen'
  , 'si_tin'
  , 'th_vat'
  , 'tw_vat'
  , 'ua_vat'
  , 'unknown'
  , 'us_ein'
  , 'za_vat'
];

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
export class InvoiceCustomerShippingDto {
  @ApiPropertyOptional()
  address?: AddressDto;

  @ApiPropertyOptional({
    description: 'The delivery service that shipped a physical product, such as Fedex, UPS, USPS, etc.'
  })
  carrier?: string | null;

  @ApiPropertyOptional({
    description: 'Recipient name.'
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Recipient phone (including extension).'
  })
  phone?: string | null;

  @ApiPropertyOptional({
    description: 'The tracking number for a physical product, obtained from the delivery service. If multiple tracking numbers were generated for this purchase, please separate them with commas.'
  })
  trackingNumber?: string | null;
}

export class CustomerTaxIdDto {
  @ApiProperty({ enum: CustomerTaxIdTypes })
  type: Stripe.Invoice.CustomerTaxId.Type;

  @ApiProperty({ description: 'The value of the tax ID.' })
  value: string | null;
}

export class InvoicePaymentMethodOptionsDto {
  @ApiProperty({
    description: 'If paying by `acss_debit`, this sub-hash contains details about the Canadian pre-authorized debit payment method options to pass to the invoice\'s PaymentIntent.'
  })
  acssDebit: Stripe.Invoice.PaymentSettings.PaymentMethodOptions.AcssDebit | null;

  @ApiProperty({
    description: 'If paying by `bancontact`, this sub-hash contains details about the Bancontact payment method options to pass to the invoice\'s PaymentIntent.'
  })
  bancontact: Stripe.Invoice.PaymentSettings.PaymentMethodOptions.Bancontact | null;

  @ApiProperty({
    description: 'If paying by `card`, this sub-hash contains details about the Card payment method options to pass to the invoice\'s PaymentIntent.'
  })
  card: Stripe.Invoice.PaymentSettings.PaymentMethodOptions.Card | null;

  @ApiProperty({
    description: 'If paying by `customer_balance`, this sub-hash contains details about the Bank transfer payment method options to pass to the invoice\'s PaymentIntent.'
  })
  customerBalance: Stripe.Invoice.PaymentSettings.PaymentMethodOptions.CustomerBalance | null;

  @ApiProperty({
    description: 'If paying by `konbini`, this sub-hash contains details about the Konbini payment method options to pass to the invoice\'s PaymentIntent.'
  })
  konbini: Stripe.Invoice.PaymentSettings.PaymentMethodOptions.Konbini | null;

  @ApiProperty({
    description: 'If paying by `us_bank_account`, this sub-hash contains details about the ACH direct debit payment method options to pass to the invoice\'s PaymentIntent.'
  })
  usBankAccount: Stripe.Invoice.PaymentSettings.PaymentMethodOptions.UsBankAccount | null;
}

export class InvoicePaymentSettingsDto {
  @ApiProperty({
    description: 'Payment-method-specific configuration to provide to the invoice\'s PaymentIntent.'
  })
  paymentMethodOptions: InvoicePaymentMethodOptionsDto | null;

  @ApiProperty({
    description: 'The list of payment method types (e.g. card) to provide to the invoice\'s PaymentIntent. If not set, Stripe attempts to automatically determine the types to use by looking at the invoice\'s default payment method, the subscription\'s default payment method, the customer\'s default payment method, and your [invoice template settings](https://dashboard.stripe.com/settings/billing/invoice).',
    enum: PaymentMethodTypes
  })
  paymentMethodTypes: Array<Stripe.Invoice.PaymentSettings.PaymentMethodType> | null;
}

export class InvoiceRenderingOptionsDto {
  @ApiProperty({
    description: 'How line-item prices and amounts will be displayed with respect to tax on invoice PDFs.'
  })
  amountTaxDisplay: string | null;
}

export class InvoiceStatusTransitionsDto {
  @ApiProperty()
  finalizedAt: number | null;
  
  @ApiProperty()
  markedUncollectibleAt: number | null;
  
  @ApiProperty()
  paidAt: number | null;
  
  @ApiProperty()
  voidedAt: number | null;
}

export class InvoiceThresholdItemReasonDto {
  @ApiProperty({ isArray: true, type: String })
  lineItemIds: Array<string>;

  @ApiProperty()
  usageGte: number;
}
export class InvoiceThresholdReasonDto {
  @ApiProperty({
    description: 'The total invoice amount threshold boundary if it triggered the threshold invoice.'
  })
  amountGte: number | null;

  @ApiProperty({
    description: 'Indicates which line items triggered a threshold invoice.',
    isArray: true,
    type: InvoiceThresholdItemReasonDto
  })
  itemReasons: Array<InvoiceThresholdItemReasonDto>;
}

export class InvoiceTotalDiscountAmountDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  discount: string | Stripe.Discount | Stripe.DeletedDiscount;
}

export class InvoiceTransferDataDto {
  @ApiProperty({
    description: 'The amount in %s that will be transferred to the destination account when the invoice is paid. By default, the entire amount is transferred to the destination.'
  })
  amount: number | null;

  @ApiProperty({
    description: 'The account where funds from the payment will be transferred to upon payment success.'
  })
  destination: string | Stripe.Account;
}

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
  automaticTax: AutomaticTaxDto;

  @ApiProperty({
    enum: [BillingReasons]
  })
  billingReason: Stripe.Invoice.BillingReason | null;

  @ApiProperty()
  charge: string | Stripe.Charge | null;

  @ApiProperty({
    enum: ['charge_automatically', 'send_invoice']
  })
  collectionMethod: Stripe.Invoice.CollectionMethod;

  @ApiProperty()
  currency: string;

  @ApiProperty({ isArray: true, type: CustomFieldDto })
  customFields: Array<CustomFieldDto> | null;

  @ApiProperty()
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null;

  @ApiProperty()
  customerAddress: AddressDto | null;

  @ApiProperty()
  customerEmail: string | null;

  @ApiProperty()
  customerName: string | null;

  @ApiProperty()
  customerPhone: string | null;

  @ApiProperty()
  customerShipping: InvoiceCustomerShippingDto | null;

  @ApiProperty({
    enum: ['exempt', 'none', 'reverse']
  })
  customerTaxExempt: Stripe.Invoice.CustomerTaxExempt | null;

  @ApiProperty({ isArray: true, type: CustomerTaxIdDto })
  customerTaxIds: Array<CustomerTaxIdDto> | null;

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

  @ApiProperty({ isArray: true, type: InvoiceLineItemDto })
  lines: Array<InvoiceLineItemDto>;

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
  paymentSettings: InvoicePaymentSettingsDto;

  @ApiProperty()
  periodEnd: number;

  @ApiProperty()
  periodStart: number;

  @ApiProperty()
  postPaymentCreditNotesAmount: number;

  @ApiProperty()
  prePaymentCreditNotesAmount: number;

  @ApiProperty()
  quote: string | QuoteDto| null;

  @ApiProperty()
  receiptNumber: string | null;

  @ApiProperty()
  renderingOptions: InvoiceRenderingOptionsDto | null;

  @ApiProperty()
  startingBalance: number;

  @ApiProperty()
  statementDescriptor: string | null;

  @ApiProperty({ enum: ['deleted', 'draft', 'open', 'paid', 'uncollectible', 'void']})
  status: 'deleted' | 'draft' | 'open' | 'paid' | 'uncollectible' | 'void' | null;

  @ApiProperty()
  statusTransitions: InvoiceStatusTransitionsDto;

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

  @ApiProperty({ enum: ['advancing', 'internal_failure', 'ready']})
  testClock: string | Stripe.TestHelpers.TestClock | null;

  @ApiProperty()
  thresholdReason?: InvoiceThresholdReasonDto;

  @ApiProperty()
  total: number;

  @ApiProperty({ isArray: true, type: InvoiceTotalDiscountAmountDto })
  totalDiscountAmounts: Array<InvoiceTotalDiscountAmountDto> | null;

  @ApiProperty()
  totalExcludingTax: number | null;

  @ApiProperty({ isArray: true, type: TaxAmountDto })
  totalTaxAmounts: Array<TaxAmountDto>;

  @ApiProperty()
  transferData: InvoiceTransferDataDto | null;

  @ApiProperty()
  webhooksDeliveredAt: number | null;

}
