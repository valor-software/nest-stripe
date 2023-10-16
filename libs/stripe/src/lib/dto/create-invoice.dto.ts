import { ApiPropertyOptional } from '@nestjs/swagger';
import { CustomFieldDto, DiscountDto, MetadataDto } from './shared.dto';

export class CreateInvoiceDto {
  @ApiPropertyOptional({
    description: 'The account tax IDs associated with the invoice. Only editable when the invoice is a draft.',
    isArray: true,
    type: String
  })
  accountTaxIds?: Array<string>;

  @ApiPropertyOptional({
    description: 'A fee in cents (or local equivalent) that will be applied to the invoice and transferred to the application owner\'s Stripe account. The request must be made with an OAuth key or the Stripe-Account header in order to take an application fee. For more information, see the application fees [documentation](https://stripe.com/docs/billing/invoices/connect#collecting-fees).'
  })
  applicationFeeAmount?: number;

  @ApiPropertyOptional({
    description: 'Controls whether Stripe will perform [automatic collection](https://stripe.com/docs/billing/invoices/workflow/#auto_advance) of the invoice. When `false`, the invoice\'s state will not automatically advance without an explicit action.'
  })
  autoAdvance?: boolean;

  @ApiPropertyOptional({
    description: 'Settings for automatic tax lookup for this invoice.\nWhether Stripe automatically computes tax on this invoice. Note that incompatible invoice items (invoice items with manually specified [tax rates](https://stripe.com/docs/api/tax_rates), negative amounts, or `tax_behavior=unspecified`) cannot be added to automatic tax invoices.'
  })
  automaticTax?: boolean;

  @ApiPropertyOptional({
    description: 'Either `charge_automatically`, or `send_invoice`. When charging automatically, Stripe will attempt to pay this invoice using the default source attached to the customer. When sending an invoice, Stripe will email this invoice to the customer with payment instructions. Defaults to `charge_automatically`.',
    enum: ['charge_automatically', 'send_invoice']
  })
  collectionMethod?: 'charge_automatically' | 'send_invoice';

  @ApiPropertyOptional({ description: 'The currency to create this invoice in. Defaults to that of `customer` if not specified.'})
  currency?: string;

  @ApiPropertyOptional({
    description: 'A list of up to 4 custom fields to be displayed on the invoice.',
    isArray: true,
    type: CustomFieldDto
  })
  customFields?: Array<CustomFieldDto>;

  @ApiPropertyOptional()
  customer?: string;

  @ApiPropertyOptional({
    description: 'The number of days from when the invoice is created until it is due. Valid only for invoices where `collection_method=send_invoice`.'
  })
  daysUntilDue?: number;

  @ApiPropertyOptional({
    description: 'ID of the default payment method for the invoice. It must belong to the customer associated with the invoice. If not set, defaults to the subscription\'s default payment method, if any, or to the default payment method in the customer\'s invoice settings.'
  })
  defaultPaymentMethodId?: string;

  @ApiPropertyOptional({
    description: 'ID of the default payment source for the invoice. It must belong to the customer associated with the invoice and be in a chargeable state. If not set, defaults to the subscription\'s default source, if any, or to the customer\'s default source.'
  })
  defaultSource?: string;

  @ApiPropertyOptional({
    description: 'The tax rates that will apply to any line item that does not have `tax_rates` set.',
    isArray: true,
    type: String,
  })
  defaultTaxRates?: Array<string>;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The coupons to redeem into discounts for the invoice. If not specified, inherits the discount from the invoice\'s customer. Pass an empty string to avoid inheriting any discounts.',
    isArray: true,
    type: DiscountDto
  })
  discounts?: Array<DiscountDto>;

  @ApiPropertyOptional({
    description: ' The date on which payment for this invoice is due. Valid only for invoices where `collection_method=send_invoice`.'
  })
  dueDate?: number;

  @ApiPropertyOptional({ isArray: true, type: String})
  expand?: Array<string>;

  @ApiPropertyOptional()
  footer?: string;

  @ApiPropertyOptional({
    description: 'Revise an existing invoice. The new invoice will be created in `status=draft`. See the [revision documentation](https://stripe.com/docs/invoicing/invoice-revisions) for more details.'
  })
  fromInvoice?: string;

  @ApiPropertyOptional({
    description: 'Set of [key-value pairs](https://stripe.com/docs/api/metadata) that you can attach to an object. This can be useful for storing additional information about the object in a structured format. Individual keys can be unset by posting an empty value to them. All keys can be unset by posting an empty value to `metadata`.'
  })
  metadata?: MetadataDto;

  @ApiPropertyOptional({
    description: 'The account (if any) for which the funds of the invoice payment are intended. If set, the invoice will be presented with the branding and support information of the specified account. See the [Invoices with Connect](https://stripe.com/docs/billing/invoices/connect) documentation for details.'
  })
  onBehalfOf?: string;

  @ApiPropertyOptional({
    description: 'How to handle pending invoice items on invoice creation. One of `include` or `exclude`. `include` will include any pending invoice items, and will create an empty draft invoice if no pending invoice items exist. `exclude` will always create an empty invoice draft regardless if there are pending invoice items or not. Defaults to `exclude` if the parameter is omitted.',
    enum: ['exclude', 'include', 'include_and_require']
  })
  pendingInvoiceItemsBehavior?: 'exclude' | 'include' | 'include_and_require';

  @ApiPropertyOptional({
    description: 'The ID of the subscription to invoice, if any. If set, the created invoice will only include pending invoice items for that subscription. The subscription\'s billing cycle and regular subscription events won\'t be affected.'
  })
  subscription?: string;
}