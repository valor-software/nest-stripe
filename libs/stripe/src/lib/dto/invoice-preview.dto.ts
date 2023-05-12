import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import Stripe from 'stripe';

export class InvoicePreviewItemDto {
  @ApiProperty()
  priceId: string;

  @ApiPropertyOptional()
  id?: string;

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

  @ApiPropertyOptional({
    enum: ['always_invoice', 'create_prorations', 'none'],
    description: `Determines how to handle [prorations](https://stripe.com/docs/subscriptions/billing-cycle#prorations) when the billing cycle changes (e.g., when switching plans, resetting \`billing_cycle_anchor=now\`, or starting a trial), or if an item's \`quantity\` changes. The default value is \`create_prorations\`.`,
  })
  @IsOptional()
  @IsEnum(['always_invoice', 'create_prorations', 'none'])
  prorationBehavior?: Stripe.InvoiceRetrieveUpcomingParams.SubscriptionProrationBehavior;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  prorationDate?: Date;

  @ApiPropertyOptional({ isArray: true, type: InvoicePreviewItemDto })
  @IsOptional()
  @IsArray()
  prices?: InvoicePreviewItemDto[];
}
