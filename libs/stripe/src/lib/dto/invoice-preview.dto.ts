import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InvoicePreviewDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  customerId: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  subscriptionId?: string;
}
