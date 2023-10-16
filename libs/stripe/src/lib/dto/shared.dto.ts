import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import Stripe from 'stripe';

export const TaxRates = [
  'gst'
, 'hst'
, 'jct'
, 'pst'
, 'qst'
, 'rst'
, 'sales_tax'
, 'vat'
]

export class AddressDto {
  @ApiProperty({ description: 'City/District/Suburb/Town/Village.' })
  city: string | null;

  @ApiProperty({ description: '2-letter country code.' })
  country: string | null;

  @ApiProperty({ description: 'Address line 1 (Street address/PO Box/Company name).' })
  line1: string | null;

  @ApiProperty({ description: 'Address line 2 (Apartment/Suite/Unit/Building).' })
  line2: string | null;

  @ApiProperty({ description: 'ZIP or postal code.' })
  postalCode: string | null;

  @ApiProperty({ description: 'State/County/Province/Region.' })
  state: string | null;
}

export class BillingDetailsAddressDto {
   @ApiPropertyOptional({ description: 'City, district, suburb, town, or village.'})
   city?: string;
  
  @ApiPropertyOptional({ description: 'Two-letter country code ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)).' })
  country?: string;
  
  @ApiPropertyOptional({ description: 'Address line 1 (e.g., street, PO Box, or company name).' })
  line1?: string;
  
  @ApiPropertyOptional({ description: 'Address line 2 (e.g., apartment, suite, unit, or building).' })
  line2?: string;
  
  @ApiPropertyOptional({ description: 'ZIP or postal code.'})
  postalCode?: string;
  
  @ApiPropertyOptional({ description: 'State, county, province, or region.' })
  state?: string;
}

export class CustomFieldDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;
}

export class PeriodDto {
  @ApiProperty({
    description: 'The end of the period, which must be greater than or equal to the start.'
  })
  end: number;

  @ApiProperty({
    description: 'The start of the period.'
  })
  start: number;
}

export class CreateAutomaticTaxDto {
  @ApiProperty()
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    enum: ['complete', 'failed', 'requires_location_inputs']
  })
  @IsEnum(['complete', 'failed', 'requires_location_inputs'])
  status: 'complete' | 'failed' | 'requires_location_inputs' | null;
}

export class AutomaticTaxDto {
  @ApiProperty()
  enabled: boolean;

  @ApiProperty({
    enum: ['complete', 'failed', 'requires_location_inputs']
  })
  status: 'complete' | 'failed' | 'requires_location_inputs' | null;
}

export class TaxAmountDto {
  @ApiProperty()
  amount: number;
  
  @ApiProperty({
    description: 'Whether this tax amount is inclusive or exclusive.'
  })
  inclusive: boolean;

  @ApiProperty()
  taxRate: string | Stripe.TaxRate;
}

export class CreateRecurringDto {
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
  trialPeriodDays?: number;

  @ApiPropertyOptional({
    description: 'Configures how the quantity per period should be determined. Can be either `metered` or `licensed`. `licensed` automatically bills the `quantity` set when adding it to a subscription. `metered` aggregates the total usage based on usage records. Defaults to `licensed`.',
    enum: ['licensed', 'metered'],
    default: 'metered'
  })
  @IsOptional()
  @IsEnum(['licensed', 'metered'])
  usageType?: 'licensed' | 'metered';
}

export class RecurringDto {
  @ApiProperty({
    description: 'Specifies a usage aggregation strategy for prices of `usage_type=metered`. Allowed values are `sum` for summing up all usage during a period, `last_during_period` for using the last usage record reported within a period, `last_ever` for using the last usage record ever (across period bounds) or `max` which uses the usage record with the maximum reported usage during a period. Defaults to `sum`.',
    enum: ['last_during_period', 'last_ever', 'max', 'sum']
  })
  aggregateUsage: Stripe.Price.Recurring.AggregateUsage | null;

  @ApiProperty({
    description: 'Specifies billing frequency. Either `day`, `week`, `month` or `year`.',
    enum: ['day', 'month', 'week', 'year']
  })
  interval: Stripe.Price.Recurring.Interval;

  @ApiProperty({
    description: 'The number of intervals between subscription billings. For example, `interval=month` and `interval_count=3` bills every 3 months. Maximum of one year interval allowed (1 year, 12 months, or 52 weeks).'
  })
  intervalCount: number;

  @ApiProperty({
    description: 'Default number of trial days when subscribing a customer to this price using [`trial_from_plan=true`](https://stripe.com/docs/api#create_subscription-trial_from_plan).'
  })
  trialPeriodDays: number;

  @ApiProperty({
    description: 'Configures how the quantity per period should be determined. Can be either `metered` or `licensed`. `licensed` automatically bills the `quantity` set when adding it to a subscription. `metered` aggregates the total usage based on usage records. Defaults to `licensed`.',
    enum: ['licensed', 'metered']
  })
  usageType?: Stripe.Price.Recurring.UsageType;
}

export class DobDto {
  @ApiProperty()
  day: number | null;
  
  @ApiProperty()
  month: number | null;
  
  @ApiProperty()
  year: number | null;
}

export class DiscountDto {
  @ApiPropertyOptional({
    description: 'ID of the coupon to create a new discount for.'
  })
  coupon?: string;

  @ApiProperty({
    description: 'ID of an existing discount on the object (or one of its ancestors) to reuse.'
  })
  discount?: string;
}

export class MetadataDto {
  [name: string]: string | number | null;
}