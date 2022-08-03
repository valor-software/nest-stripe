import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Stripe from 'stripe';
import { BaseDto } from '../base.dto';
import { PriceDto } from './price.dto';

export class ProductDto extends BaseDto {
  @ApiProperty({ type: 'string', isArray: true })
  attributes: Array<string> | null;

  @ApiProperty()
  caption: string | null;

  @ApiProperty()
  deactivateOn?: Array<string>;

  @ApiProperty()
  defaultPrice?: string | PriceDto | null;

  @ApiProperty()
  description: string | null;

  @ApiProperty({ type: 'string', isArray: true })
  images: Array<string>;

  @ApiProperty()
  name: string;

  @ApiProperty()
  packageDimensions: Stripe.Product.PackageDimensions | null;

  @ApiProperty()
  shippable: boolean | null;

  @ApiProperty()
  statementDescriptor: string | null;

  @ApiProperty()
  taxCode: string | Stripe.TaxCode | null;

  @ApiProperty({ enum: ['good', 'service']})
  type: 'good' | 'service';

  @ApiProperty()
  unitLabel: string | null;

  @ApiProperty()
  url: string | null;

  @ApiPropertyOptional({ isArray: true, type: PriceDto })
  prices?: PriceDto[];

}
