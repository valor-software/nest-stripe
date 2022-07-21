import { ApiProperty } from '@nestjs/swagger';
import Stripe from 'stripe';
import { BaseDto } from '../base.dto';
import { PeriodDto, TaxAmountDto } from '../shared.dto';
import { PlanDto } from './plan.dto';
import { PriceDto } from './price.dto';

export class DiscountAmountDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  discount: string | Stripe.Discount | Stripe.DeletedDiscount;
}

export class CreditedItemsDto {
  @ApiProperty({ description: 'Invoice containing the credited invoice line items' })
  invoice: string;

  @ApiProperty({ description: 'Credited invoice line items', isArray: true, type: 'string' })
  invoiceLineItems: Array<string>;
}

export class ProrationDetailsDto {
  @ApiProperty({ description: 'For a credit proration `line_item`, the original debit line_items to which the credit proration applies.' })
  creditedItems: CreditedItemsDto | null;
}

export class InvoiceLineItemDto extends BaseDto {

  @ApiProperty()
  amount: number;

  @ApiProperty({
    description: 'The integer amount in %s representing the amount for this line item, excluding all tax and discounts.'
  })
  amountExcludingTax: number | null;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  description: string | null;

  @ApiProperty({ isArray: true, type: DiscountAmountDto })
  discountAmounts: Array<DiscountAmountDto> | null;

  @ApiProperty()
  discountable: boolean;

  @ApiProperty({ isArray: true, type: 'string' })
  discounts: Array<string | Stripe.Discount> | null;

  @ApiProperty()
  invoiceItem?: string;
  
  @ApiProperty()
  period: PeriodDto;

  @ApiProperty({ description: 'The plan of the subscription, if the line item is a subscription or a proration.'})
  plan: PlanDto | null;

  @ApiProperty({ description: 'The price of the line item.' })
  price: PriceDto | null;

  @ApiProperty()
  proration: boolean;

  @ApiProperty({ description: 'Additional details for proration line items' })
  prorationDetails: ProrationDetailsDto | null;
  
  @ApiProperty({ description: 'The quantity of the subscription, if the line item is a subscription or a proration.' })
  quantity: number | null;
  
  @ApiProperty({ description: 'The subscription that the invoice item pertains to, if any.' })
  subscription: string | null;
  
  @ApiProperty({ description: 'The subscription item that generated this invoice item. Left empty if the line item is not an explicit result of a subscription.' })
  subscriptionItem?: string;
  
  @ApiProperty({
    description: 'The amount of tax calculated per tax rate for this line item',
    isArray: true,
    type: TaxAmountDto
  })
  taxAmounts?: Array<TaxAmountDto>;

  @ApiProperty({ isArray: true })
  taxRates?: Array<Stripe.TaxRate>;

  @ApiProperty({
    description: 'A string identifying the type of the source of this line item, either an `invoiceitem` or a `subscription`.',
    enum: ['invoiceitem', 'subscription']
  })
  type: Stripe.InvoiceLineItem.Type;

  @ApiProperty({
    description: 'The amount in %s representing the unit amount for this line item, excluding all tax and discounts.'
  })
  unitAmountExcludingTax: string | null;
}
