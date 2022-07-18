import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class Shipping {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  addressLine2: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  phone?: string;
}

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;;

  @ApiPropertyOptional({
    description: 'The prefix for the customer used to generate unique invoice numbers. Must be 3–12 uppercase letters or numbers.'
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(12)
  invoicePrefix?: string;

  @ApiPropertyOptional()
  metadata: {[name: string]: string |  number | null};

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({
    type: 'string',
    isArray: true
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredLocales?: Array<string>;

  @ApiPropertyOptional({
    description: 'The API ID of a promotion code to apply to the customer. The customer will have a discount applied on all recurring payments. Charges you create through the API will not have the discount.'
  })
  @IsOptional()
  @IsString()
  promotionCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ type: Shipping })
  shipping?: Shipping;
  @ApiPropertyOptional({
    enum: ['exempt', 'none', 'reverse'],
    default: 'none' ,
    description: `The customer's tax exemption. One of \`none\`, \`exempt\`, or \`reverse\`.`
  })
  @IsOptional()
  @IsEnum(['exempt', 'none', 'reverse'])
  taxExempt?: 'exempt' | 'none' | 'reverse';
}