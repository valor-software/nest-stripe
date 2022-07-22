import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Stripe from 'stripe';
import { BaseDto } from '../base.dto';
import { RecurringDto } from '../shared.dto';

export class PriceDto extends BaseDto {

  @ApiProperty({ enum: ['per_unit', 'tiered']})
  billingScheme: 'per_unit' | 'tiered';

  @ApiProperty()
  currency: string;

  @ApiProperty()
  lookupKey: string | null;

  @ApiProperty()
  nickname: string | null;

  @ApiProperty()
  product: string | Stripe.Product | Stripe.DeletedProduct;

  @ApiProperty()
  recurring: RecurringDto | null;

  @ApiProperty({ enum: ['exclusive', 'inclusive', 'unspecified']})
  taxBehavior: 'exclusive' | 'inclusive' | 'unspecified' | null;

  @ApiPropertyOptional({ isArray: true })
  tiers?: Array<Stripe.Price.Tier>;

  @ApiProperty({ enum: ['graduated', 'volume']})
  tiersMode: 'graduated' | 'volume' | null;

  @ApiProperty()
  transformQuantity: Stripe.Price.TransformQuantity | null;

  @ApiProperty({ enum: ['one_tim', 'recurring']})
  type: 'one_time' | 'recurring' | null;

  @ApiProperty()
  unitAmount: number | null;

  @ApiProperty()
  unitAmountDecimal: string | null;
}
