import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString } from 'class-validator';
import Stripe from 'stripe';
import { WebhookEventType } from '../webhook/event-types.enum';

export class CreateWebhookEndpointDto {
  @ApiProperty({
    enum: WebhookEventType,
    isArray: true
  })
  @IsEnum(WebhookEventType, { each: true })
  enabledEvents: Array<WebhookEventType>;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  connect?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmptyObject()
  metadata: Stripe.MetadataParam;
}

export class UpdateWebhookEndpointDto {
  @ApiPropertyOptional({
    enum: WebhookEventType,
    isArray: true
  })
  @IsOptional()
  @IsEnum(WebhookEventType, { each: true })
  enabledEvents: Array<WebhookEventType>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  connect?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  disabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmptyObject()
  metadata?: Stripe.MetadataParam;
}
