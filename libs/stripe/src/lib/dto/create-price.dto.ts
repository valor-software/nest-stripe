import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsNumberString, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ProductData } from './product.data.dto';

export class RecurringDto {
  @ApiPropertyOptional({
    description: 'Specifies a usage aggregation strategy for prices of `usage_type=metered`. Allowed values are `sum` for summing up all usage during a period, `last_during_period` for using the last usage record reported within a period, `last_ever` for using the last usage record ever (across period bounds) or `max` which uses the usage record with the maximum reported usage during a period. Defaults to `sum`.',
    enum: ['last_during_period', 'last_ever', 'max', 'sum']
  })
  @IsOptional()
  @IsEnum(['last_during_period', 'last_ever', 'max', 'sum'])
  aggregateUsage?: 'last_during_period' | 'last_ever' | 'max' | 'sum';

  @ApiPropertyOptional({
    description: 'Specifies billing frequency. Either `day`, `week`, `month` or `year`.',
    enum: ['day', 'month', 'week', 'year']
  })
  @IsOptional()
  @IsEnum(['day', 'month', 'week', 'year'])
  interval: 'day' | 'month' | 'week' | 'year';

  @ApiPropertyOptional({
    description: 'The number of intervals between subscription billings. For example, `interval=month` and `interval_count=3` bills every 3 months. Maximum of one year interval allowed (1 year, 12 months, or 52 weeks).'
  })
  @IsOptional()
  @IsNumber()
  intervalCount?: number;

  @ApiPropertyOptional({
    description: 'Default number of trial days when subscribing a customer to this price using [`trial_from_plan=true`](https://stripe.com/docs/api#create_subscription-trial_from_plan).'
  })
  @IsOptional()
  @IsNumber()
  trialPeriod_Days?: number;

  @ApiPropertyOptional({
    description: 'Configures how the quantity per period should be determined. Can be either `metered` or `licensed`. `licensed` automatically bills the `quantity` set when adding it to a subscription. `metered` aggregates the total usage based on usage records. Defaults to `licensed`.',
    enum: ['licensed', 'metered'],
    default: 'metered'
  })
  @IsOptional()
  @IsEnum(['licensed', 'metered'])
  usageType?: 'licensed' | 'metered';
}

export class TierDto {

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  flatAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  flatAmountDecimal?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  unitAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  unitAmountDecimal?: string;

  @ApiPropertyOptional()
  upTo: 'inf' | number;
}

export class CreatePriceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currency: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Describes how to compute the price per period. Either `per_unit` or `tiered`. `per_unit` indicates that the fixed amount (specified in `unit_amount` or `unit_amount_decimal`) will be charged per unit in `quantity` (for prices with `usage_type=licensed`), or per unit of total usage (for prices with `usage_type=metered`). `tiered` indicates that the unit pricing will be computed using a tiering strategy as defined using the `tiers` and `tiers_mode` attributes.',
    enum: ['per_unit', 'tiered']
  })
  @IsOptional()
  @IsEnum(['per_unit', 'tiered'])
  billingScheme?: 'per_unit' | 'tiered';

  @ApiPropertyOptional({
    description: 'A lookup key used to retrieve prices dynamically from a static string. This may be up to 200 characters.'
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  lookupKey?: string;

  @ApiPropertyOptional()
  metadata?: {[name: string]: string | number | null};

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiPropertyOptional({
    description: 'The ID of the product that this price will belong to.'
  })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional()
  productData?: ProductData;

  @ApiPropertyOptional({
    description: 'The recurring components of a price such as `interval` and `usage_type`.'
  })
  recurring?: RecurringDto;

  @ApiPropertyOptional({
    description: 'Specifies whether the price is considered inclusive of taxes or exclusive of taxes. One of `inclusive`, `exclusive`, or `unspecified`. Once specified as either `inclusive` or `exclusive`, it cannot be changed.',
    enum: ['exclusive', 'inclusive', 'unspecified']
  })
  @IsOptional()
  @IsEnum(['exclusive', 'inclusive', 'unspecified'])
  taxBehavior?: 'exclusive' | 'inclusive' | 'unspecified';

  @ApiPropertyOptional({ type: TierDto, isArray: true })
  tier: TierDto[]

  @ApiPropertyOptional({
    description: 'Defines if the tiering price should be `graduated` or `volume` based. In `volume`-based tiering, the maximum quantity within a period determines the per unit price, in `graduated` tiering pricing can successively change as the quantity grows.',
    enum: ['graduated', 'volume']
  })
  @IsOptional()
  @IsEnum(['graduated', 'volume'])
  tiersMode?: 'graduated' | 'volume';

  @ApiPropertyOptional({
    description: ' If set to true, will atomically remove the lookup key from the existing price, and assign it to this price.'
  })
  transferLookupKey?: boolean;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number

  @ApiPropertyOptional({ type: 'string', isArray: true })
  @IsOptional()
  @IsArray()
  expand?: Array<string>;

}