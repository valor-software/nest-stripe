import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNotEmptyObject, IsNumberString, IsOptional, IsPositive, isString, IsString, MaxLength, Min } from 'class-validator';
import Stripe from 'stripe';

export class CreateProductDefaultPriceDataRecurringDto {
  @ApiProperty({
    description: 'Specifies billing frequency. Either `day`, `week`, `month` or `year`.',
    enum: ['day', 'month', 'week', 'year']
  })
  @IsOptional()
  @IsEnum(['day', 'month', 'week', 'year'])
  interval: Stripe.ProductCreateParams.DefaultPriceData.Recurring.Interval;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  @Min(1)
  intervalCount?: number;
}

export class CreateProductDefaultPriceDataDto {
  @ApiProperty()
  currency: string;

  @ApiPropertyOptional({
    description: 'Prices defined in each available currency option. Each key must be a three-letter [ISO currency code](https://www.iso.org/iso-4217-currency-codes.html) and a [supported currency](https://stripe.com/docs/currencies).'
  })
  currencyOptions?: {
    [key: string]: Stripe.ProductCreateParams.DefaultPriceData.CurrencyOptions;
  };

  @ApiPropertyOptional({
    description: 'The recurring components of a price such as `interval` and `interval_count`.'
  })
  recurring?: CreateProductDefaultPriceDataRecurringDto;

  @ApiPropertyOptional({
    description: ' Specifies whether the price is considered inclusive of taxes or exclusive of taxes. One of `inclusive`, `exclusive`, or `unspecified`. Once specified as either `inclusive` or `exclusive`, it cannot be changed.',
    enum: ['exclusive', 'inclusive', 'unspecified']
  })
  @IsOptional()
  @IsEnum(['exclusive', 'inclusive', 'unspecified'])
  taxBehavior?: Stripe.ProductCreateParams.DefaultPriceData.TaxBehavior;

  @ApiPropertyOptional({
    description: 'A positive integer in cents (or local equivalent) (or 0 for a free price) representing how much to charge. One of `unit_amount` or `unit_amount_decimal` is required.'
  })
  @IsOptional()
  @IsPositive()
  @IsInt()
  unitAmount?: number;

  @ApiPropertyOptional({
    description: 'Same as `unit_amount`, but accepts a decimal value in cents (or local equivalent) with at most 12 decimal places. Only one of `unit_amount` and `unit_amount_decimal` can be set.'
  })
  @IsOptional()
  @IsNumberString()
  unitAmountDecimal?: string;
}

export class CreateProductPackageDimensionsDto {

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

export class CreateProductDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

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
  @IsNotEmptyObject()
  defaultPriceData?: CreateProductDefaultPriceDataDto;

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
  @IsNotEmptyObject()
  packageDimensions?: CreateProductPackageDimensionsDto;

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
    enum: ['good', 'service'],
    description: 'The type of the product. Defaults to `service` if not explicitly specified, enabling use of this product with Subscriptions and Plans. Set this parameter to `good` to use this product with Orders and SKUs. On API versions before `2018-02-05`, this field defaults to `good` for compatibility reasons.'
  })
  @IsOptional()
  @IsEnum(['good', 'service'])
  type?: Stripe.ProductCreateParams.Type;

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