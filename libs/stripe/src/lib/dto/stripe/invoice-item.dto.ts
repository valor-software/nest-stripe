import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from '../base.dto';
import { CustomerDto } from './customer.dto';
import { DiscountDto, PeriodDto } from '../shared.dto';
import { InvoiceDto } from './invoice.dto';
import { PlanDto } from './plan.dto';
import { PriceDto } from './price.dto';

export class InvoiceItemDto extends BaseDto  {
  @ApiPropertyOptional({
    description: 'Amount (in the `currency` specified) of the invoice item. This should always be equal to `unit_amount * quantity`.'
  })
  amount: number;

  @ApiPropertyOptional()
  currency: string;

  @ApiPropertyOptional()
  customerId?: string;

  @ApiPropertyOptional()
  customer?: CustomerDto;

  @ApiPropertyOptional({
    description: 'Time at which the object was created. Measured in seconds since the Unix epoch.'
  })
  date?: Date;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional({
    description: 'If true, discounts will apply to this invoice item. Always false for prorations.'
  })
  discountable?: boolean;

  @ApiPropertyOptional({
    isArray: true,
    type: String
  })
  discountIds?: Array<string>;

  @ApiPropertyOptional({
    description: 'The discounts which apply to the invoice item. Item discounts are applied before invoice discounts. Use `expand[]=discounts` to expand each discount.',
    isArray: true,
    type: String
  })
  discounts?: Array<DiscountDto>;

  @ApiPropertyOptional()
  invoiceId?: string;

  @ApiPropertyOptional()
  invoice?: InvoiceDto;

  @ApiPropertyOptional()
  period?: PeriodDto;

  @ApiPropertyOptional({
    description: 'If the invoice item is a proration, the plan of the subscription that the proration was computed for.'
  })
  plan?: PlanDto;

  @ApiPropertyOptional({
    description: 'The price of the invoice item.'
  })
  price?: PriceDto;

  @ApiPropertyOptional({
    description: 'Whether the invoice item was created automatically as a proration adjustment when the customer switched plans.'
  })
  proration?: boolean;

  @ApiPropertyOptional({
    description: 'Quantity of units for the invoice item. If the invoice item is a proration, the quantity of the subscription that the proration was computed for.'
  })
  quantity?: number;

  @ApiPropertyOptional({
    description: ' The subscription that this invoice item has been created for, if any.'
  })
  subscriptionId?: string;

  @ApiPropertyOptional({
    description: 'The subscription item that this invoice item has been created for, if any.'
  })
  subscriptionItemId?: string;

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
