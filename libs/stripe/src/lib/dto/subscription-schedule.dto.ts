import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseDto } from './base.dto';
import { PeriodDto } from './shared.dto';
import Stripe from 'stripe';

const EndBehaviors = ['cancel', 'none', 'release', 'renew'];
const Statuses = [
  'active',
  'canceled',
  'completed',
  'not_started',
  'released',
]
const BillingCycleAnchors = ['automatic', 'phase_start'];
const ProrationBehaviors =[
  'always_invoice',
  'create_prorations',
  'none',
]

export class SchedulePhaseDtoItem {
  @ApiPropertyOptional()
  planId?: string;
  @ApiPropertyOptional()
  priceId?: string;
  @ApiPropertyOptional()
  quantity?: number;
}

export class SchedulePhaseDto {

  @ApiProperty({ enum: BillingCycleAnchors })
  billingCycleAnchor?:  'automatic' | 'phase_start' | null;

  @ApiPropertyOptional()
  currency?: string;
  
  @ApiPropertyOptional()
  defaultPaymentMethod?: string | null;
  
  @ApiPropertyOptional()
  description?: string | null;
  
  @ApiPropertyOptional()
  endDate?: number;

  @ApiPropertyOptional({
    isArray: true,
    type: SchedulePhaseDtoItem
  })
  items?: Array<SchedulePhaseDtoItem>;

  @ApiPropertyOptional({ enum: ProrationBehaviors})
  prorationBehavior?: Stripe.SubscriptionSchedule.Phase.ProrationBehavior;

  @ApiPropertyOptional()
  startDate?: number;
}

export class SubscriptionScheduleDto extends BaseDto {
  @ApiPropertyOptional()
  canceledAt: number | null;

  @ApiPropertyOptional()
  completedAt: number | null;

  @ApiPropertyOptional()
  currentPhase: PeriodDto

  @ApiPropertyOptional()
  customerId: string;

  @ApiPropertyOptional({
    enum: EndBehaviors
  })
  endBehavior: Stripe.SubscriptionSchedule.EndBehavior;

  @ApiPropertyOptional()
  releasedAt: number | null;

  @ApiPropertyOptional()
  releasedSubscriptionId: string;

  @ApiPropertyOptional({
    enum: Statuses
  })
  status: Stripe.SubscriptionSchedule.Status;

  @ApiPropertyOptional()
  subscriptionId: string;

  @ApiPropertyOptional({
    isArray: true,
    type: SchedulePhaseDto
  })
  phases: SchedulePhaseDto[]

}

export class CreateSubscriptionScheduleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerId?: string;

  // TODO: Describe DTO
  @ApiPropertyOptional()
  defaultSettings?: Stripe.SubscriptionScheduleCreateParams.DefaultSettings;

  @ApiPropertyOptional({
    enum: EndBehaviors
  })
  @IsOptional()
  @IsEnum(EndBehaviors)
  endBehavior?: Stripe.SubscriptionSchedule.EndBehavior;

  @ApiPropertyOptional({
    description: `Migrate an existing subscription to be managed by a subscription schedule. If this parameter is set, a subscription schedule will be created using the subscription's item(s), set to auto-renew using the subscription's interval. When using this parameter, other parameters (such as phase values) cannot be set. To create a subscription schedule with other modifications, we recommend making two separate API calls.`,
  })
  @IsOptional()
  @IsString()
  fromSubscription?: string;

  @ApiPropertyOptional()
  metadata?: {[name: string]: string | number | null};

  // TODO: Describe DTO
  @ApiPropertyOptional({
    isArray: true,
    type: SchedulePhaseDto
  })
  phases?: Array<SchedulePhaseDto>;

  @ApiPropertyOptional({
    description: `When the subscription schedule starts. We recommend using \`now\` so that it starts the subscription immediately. You can also use a Unix timestamp to backdate the subscription so that it starts on a past date, or set a future date for the subscription to start on.`
  })
  startDate?: number | 'now'
}

export class UpdateSubscriptionScheduleDto {

  // TODO: Describe DTO
  @ApiPropertyOptional()
  defaultSettings?: Stripe.SubscriptionScheduleCreateParams.DefaultSettings;

  @ApiPropertyOptional({
    enum: EndBehaviors
  })
  @IsOptional()
  @IsEnum(EndBehaviors)
  endBehavior?: Stripe.SubscriptionSchedule.EndBehavior;

  @ApiPropertyOptional()
  metadata?: {[name: string]: string | number | null};

  // TODO: Describe DTO
  @ApiPropertyOptional({
    isArray: true,
    type: SchedulePhaseDto
  })
  phases?: Array<SchedulePhaseDto>;
}