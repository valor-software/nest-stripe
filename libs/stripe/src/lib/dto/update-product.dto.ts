import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNotEmptyObject, IsNumberString, IsOptional, IsPositive, isString, IsString, MaxLength, Min } from 'class-validator';
import Stripe from 'stripe';

export class UpdateProductPackageDimensionsDto {

  @ApiProperty({
    description: 'Height, in inches. Maximum precision is 2 decimal places.'
  })
  height: number;
  
  @ApiProperty({
    description: 'Length, in inches. Maximum precision is 2 decimal places.'
  })
  length: number;
  
  @ApiProperty({
    description: 'Weight, in ounces. Maximum precision is 2 decimal places.'
  })
  weight: number;
  
  @ApiProperty({
    description: 'Width, in inches. Maximum precision is 2 decimal places.'
  })
  width: number;
}

export class UpdateProductDto {

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ isArray: true, type: String })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attributes?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  caption: string;

  @ApiPropertyOptional({
    isArray: true,
    type: String,
    description: 'An array of Connect application names or identifiers that should not be able to order the SKUs for this product. May only be set if type=`good`.'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  deactivateOn?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    isArray: true,
    type: String,
    description: 'A list of up to 8 URLs of images for this product, meant to be displayable to the customer.'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: Array<string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmptyObject()
  metadata?: Stripe.MetadataParam;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmptyObject()
  packageDimensions?: UpdateProductPackageDimensionsDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  shippable?: boolean;

  @ApiPropertyOptional({
    description: [
      'An arbitrary string to be displayed on your customer\'s credit card or bank statement. While most banks display this information consistently, some may display it incorrectly or not at all.',
      'This may be up to 22 characters. The statement description may not include `<`, `>`, `\\`, `"`, `\'` characters, and will appear on your customer\'s statement in capital letters. Non-ASCII characters are automatically stripped.',
      'It must contain at least one letter.'
    ].join('\n')
  })
  @IsOptional()
  @IsString()
  statementDescriptor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  taxCode?: string;

  @ApiPropertyOptional({
    description: 'A label that represents units of this product in Stripe and on customers\' receipts and invoices. When set, this will be included in associated invoice line item descriptions.'
  })
  @IsOptional()
  @IsString()
  unitLabel?: string;

  @ApiPropertyOptional({ description: 'A URL of a publicly-accessible webpage for this product.'})
  @IsOptional()
  @IsString()
  url?: string;

}