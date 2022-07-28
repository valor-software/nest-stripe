import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaymentItemDto } from './payment-item.dto';

export class CreatePaymentIntentDto {
  @ApiProperty({ type: PaymentItemDto, isArray: true })
  @IsNotEmpty()
  items: PaymentItemDto[];
  @ApiPropertyOptional()
  metadata?: { [name: string]: string | number | null };
  @ApiPropertyOptional()
  currency?: string;
  @ApiPropertyOptional()
  customer?: string;
  @ApiPropertyOptional()
  description?: string;
}
