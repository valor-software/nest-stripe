import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import Stripe from 'stripe';
import { PaymentItemDto } from './payment-item.dto';

export class CreateCheckoutSessionDto {
  @ApiProperty({ type: PaymentItemDto, isArray: true })
  @IsNotEmpty()
  items: PaymentItemDto[];
  @ApiPropertyOptional()
  metadata?: { [name: string]: string | number | null };
  @ApiPropertyOptional({
    enum: ['payment', 'setup', 'subscription'],
    default: 'payment'
  })
  mode: 'payment' | 'setup' | 'subscription';
  @ApiPropertyOptional()
  currency?: string;
  @ApiPropertyOptional()
  customer?: string;

  @ApiPropertyOptional({
    enum: ['day', 'month', 'week', 'year']
  })
  @IsOptional()
  @IsEnum(['day', 'month', 'week', 'year'])
  recurringInterval?: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Recurring.Interval;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  recurringIntervalCount?: number
}
