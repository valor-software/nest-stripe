import { ApiProperty } from '@nestjs/swagger';
import Stripe from 'stripe';
import { BaseDto } from '../base.dto';
import { ProductDto } from './product.dto';

export class PlanDto extends BaseDto {

  @ApiProperty({ enum: ['last_during_period', 'last_ever', 'max', 'sum']})
  aggregateUsage: 'last_during_period' | 'last_ever' | 'max' | 'sum' | null;

  @ApiProperty()
  amount: number | null;

  @ApiProperty()
  amountDecimal: string | null;

  @ApiProperty({ enum: ['per_unit', 'tiered']})
  billingScheme: 'per_unit' | 'tiered';

  @ApiProperty()
  currency: string;

  @ApiProperty({ enum: ['day', 'month', 'week', 'year'] })
  interval: 'day' | 'month' | 'week' | 'year';

  @ApiProperty()
  intervalCount: number;

  @ApiProperty()
  nickname: string | null;

  @ApiProperty()
  product: string | ProductDto | null;

  @ApiProperty({ isArray: true, type: Object })
  tiers?: Array<Stripe.Plan.Tier>;

  @ApiProperty({ enum: ['graduated', 'volume']})
  tiersMode: 'graduated' | 'volume' | null;

  @ApiProperty()
  transformUsage: Stripe.Plan.TransformUsage | null;

  @ApiProperty()
  trialPeriodDays: number | null;

  @ApiProperty({ enum: ['licensed', 'metered']})
  usageType: 'licensed' | 'metered';

}
