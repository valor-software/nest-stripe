import {
  UseGuards,
  UsePipes,
  ValidationPipe,
  Controller,
  Post,
  Body,
  Param,
  Get} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  BaseDataResponse,
  SubscriptionScheduleDto,
  CreateSubscriptionScheduleDto,
  UpdateSubscriptionScheduleDto
} from '../dto';
import { StripeAuthGuard } from '../stripe-auth.guard';
import { StripeService } from '../stripe.service';

@ApiBearerAuth()
@ApiTags('Stripe: Subscription Schedule')
@UseGuards(StripeAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('stripe/subscription-schedule')
export class SubscriptionScheduleController {
  constructor(private stripeService: StripeService) {}

  @ApiResponse({ type: Promise<BaseDataResponse<SubscriptionScheduleDto>> })
  @Post('create')
  createSubscription(
    @Body() dto: CreateSubscriptionScheduleDto
  ): Promise<BaseDataResponse<SubscriptionScheduleDto>> {
    return this.stripeService.createSubscriptionSchedule(dto);
  }

  @ApiResponse({ type: SubscriptionScheduleDto })
  @Post(':subscriptionId/update')
  updateSubscription(
    @Param('subscriptionId') scheduleId: string,
    @Body() dto: UpdateSubscriptionScheduleDto
  ): Promise<BaseDataResponse<SubscriptionScheduleDto>> {
    return this.stripeService.updateSubscriptionSchedule(scheduleId, dto);
  }

  @ApiResponse({ type: BaseDataResponse<SubscriptionScheduleDto> })
  @Get(':scheduleId')
  getSubscriptionById(
    @Param('scheduleId') scheduleId: string
  ): Promise<BaseDataResponse<SubscriptionScheduleDto>> {
    return this.stripeService.getSubscriptionScheduleById(scheduleId);
  }

  @ApiResponse({ type: Promise<BaseDataResponse<SubscriptionScheduleDto>> })
  @Post(':scheduleId/release')
  releaseSubscriptionSchedule(
    @Param('subscriptionId') scheduleId: string
  ): Promise<BaseDataResponse<SubscriptionScheduleDto>> {
    return this.stripeService.releaseSubscriptionSchedule(scheduleId);
  }

}