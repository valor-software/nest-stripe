import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
