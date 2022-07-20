import { ApiPropertyOptional } from '@nestjs/swagger';

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
