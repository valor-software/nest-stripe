import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InvoicePreviewItemDto {
  @ApiProperty()
  priceId: string;

  @ApiPropertyOptional()
  quantity?: number;
}

export class InvoicePreviewDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  subscriptionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  prorationDate?: Date;

  @ApiPropertyOptional({ isArray: true, type: InvoicePreviewItemDto })
  @IsOptional()
  @IsArray()
  prices?: InvoicePreviewItemDto[];
}
