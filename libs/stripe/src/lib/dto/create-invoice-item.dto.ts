import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountDto, MetadataDto, PeriodDto } from './shared.dto';

type TaxBehavior = 'exclusive' | 'inclusive' | 'unspecified'
const TaxBehaviors = ['exclusive', 'inclusive', 'unspecified'];

export class InvoiceItemPriceDataDto {
  @ApiProperty()
  currency: string;

  @ApiProperty()
  product: string;

  @ApiPropertyOptional({
    description: 'Only required if a [default tax behavior](https://stripe.com/docs/tax/products-prices-tax-categories-tax-behavior#setting-a-default-tax-behavior-(recommended)) was not provided in the Stripe Tax settings. Specifies whether the price is considered inclusive of taxes or exclusive of taxes. One of `inclusive`, `exclusive`, or `unspecified`. Once specified as either `inclusive` or `exclusive`, it cannot be changed.',
    enum: TaxBehaviors
  })
  taxBehavior?: TaxBehavior;

  @ApiPropertyOptional({
    description: 'A positive integer in cents (or local equivalent) (or 0 for a free price) representing how much to charge.'
  })
  unitAmount?: number;

  @ApiPropertyOptional({
    description: 'Same as `unit_amount`, but accepts a decimal value in cents (or local equivalent) with at most 12 decimal places. Only one of `unit_amount` and `unit_amount_decimal` can be set.'
  })
  unitAmountDecimal?: string;
}

export class CreateInvoiceItemDto {
  @ApiProperty()
  customer: string;

  @ApiPropertyOptional({
    description: 'The integer amount in cents (or local equivalent) of the charge to be applied to the upcoming invoice. Passing in a negative `amount` will reduce the `amount_due` on the invoice.'
  })
  amount?: number;

  @ApiPropertyOptional()
  currency?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Controls whether discounts apply to this invoice item. Defaults to false for prorations or negative invoice items, and true for all other invoice items.'
  })
  discountable?: boolean;

  @ApiPropertyOptional({
    description: 'The coupons to redeem into discounts for the invoice item or invoice line item.',
    isArray: true,
    type: DiscountDto
  })
  discounts?: DiscountDto[];

  @ApiPropertyOptional({
    isArray: true,
    type: String
  })
  expand?: Array<string>;

  @ApiPropertyOptional({
    description: 'The ID of an existing invoice to add this invoice item to. When left blank, the invoice item will be added to the next upcoming scheduled invoice. This is useful when adding invoice items in response to an invoice.created webhook. You can only add invoice items to draft invoices and there is a maximum of 250 items per invoice.'
  })
  invoice?: string;

  @ApiPropertyOptional({
    description: 'Set of [key-value pairs](https://stripe.com/docs/api/metadata) that you can attach to an object. This can be useful for storing additional information about the object in a structured format. Individual keys can be unset by posting an empty value to them. All keys can be unset by posting an empty value to `metadata`.'
  })
  metadata?: MetadataDto;

  @ApiPropertyOptional({
    description: 'The period associated with this invoice item. When set to different values, the period will be rendered on the invoice. If you have [Stripe Revenue Recognition](https://stripe.com/docs/revenue-recognition) enabled, the period will be used to recognize and defer revenue. See the [Revenue Recognition documentation](https://stripe.com/docs/revenue-recognition/methodology/subscriptions-and-invoicing) for details.'
  })
  period?: PeriodDto;

  @ApiPropertyOptional()
  price?: string;

  @ApiPropertyOptional()
  priceData?: InvoiceItemPriceDataDto;

  @ApiPropertyOptional({
    description: 'Non-negative integer. The quantity of units for the invoice item.'
  })
  quantity?: number;

  @ApiPropertyOptional({
    description: 'The ID of a subscription to add this invoice item to. When left blank, the invoice item will be be added to the next upcoming scheduled invoice. When set, scheduled invoices for subscriptions other than the specified subscription will ignore the invoice item. Use this when you want to express that an invoice item has been accrued within the context of a particular subscription.'
  })
  subscription?: string;

  @ApiPropertyOptional({
    description: 'Only required if a [default tax behavior](https://stripe.com/docs/tax/products-prices-tax-categories-tax-behavior#setting-a-default-tax-behavior-(recommended)) was not provided in the Stripe Tax settings. Specifies whether the price is considered inclusive of taxes or exclusive of taxes. One of `inclusive`, `exclusive`, or `unspecified`. Once specified as either `inclusive` or `exclusive`, it cannot be changed.',
    enum: TaxBehaviors
  })
  taxBehavior?: TaxBehavior;

  @ApiPropertyOptional({
    description: 'A [tax code](https://stripe.com/docs/tax/tax-categories) ID.'
  })
  taxCode?:string;

  @ApiPropertyOptional({
    description: 'The tax rates which apply to the invoice item. When set, the `default_tax_rates` on the invoice do not apply to this invoice item.',
    isArray: true,
    type: String
  })
  taxRates?: Array<string>;

  @ApiPropertyOptional({
    description: 'The integer unit amount in cents (or local equivalent) of the charge to be applied to the upcoming invoice. This `unit_amount` will be multiplied by the quantity to get the full amount. Passing in a negative `unit_amount` will reduce the `amount_due` on the invoice.'
  })
  unitAmount?: number;

  @ApiPropertyOptional({
    description: 'Same as `unit_amount`, but accepts a decimal value in cents (or local equivalent) with at most 12 decimal places. Only one of `unit_amount` and `unit_amount_decimal` can be set.'
  })
  unitAmountDecimal?: string;
}
