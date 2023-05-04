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
  CreateSubscriptionDto,
  CreateSubscriptionItemDto,
  SubscriptionDto,
  SubscriptionResponse,
  UpdateSubscriptionDto
} from '../dto';
import { StripeAuthGuard } from '../stripe-auth.guard';
import { StripeService } from '../stripe.service';
import Stripe from 'stripe';

@ApiBearerAuth()
@ApiTags('Stripe: Subscription')
@UseGuards(StripeAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('stripe/subscription')
export class SubscriptionController {
  constructor(private stripeService: StripeService) {}

  @ApiResponse({ type: SubscriptionResponse })
  @Post('create')
  createSubscription(@Body() dto: CreateSubscriptionDto): Promise<SubscriptionResponse> {
    return this.stripeService.createSubscription(dto);
  }

  @ApiResponse({ type: BaseDataResponse<SubscriptionDto> })
  @Get(':subscriptionId')
  getSubscriptionById(
    @Param('subscriptionId') subscriptionId: string
  ): Promise<BaseDataResponse<SubscriptionDto>> {
    return this.stripeService.getSubscriptionById(subscriptionId);
  }

  @ApiResponse({ type: SubscriptionResponse })
  @Post(':subscriptionId/update')
  updateSubscription(
    @Param('subscriptionId') subscriptionId: string,
    @Body() dto: UpdateSubscriptionDto
  ): Promise<SubscriptionResponse> {
    return this.stripeService.updateSubscription(subscriptionId, dto);
  }

  @ApiResponse({ type: SubscriptionResponse })
  @Post(':subscriptionId/cancel')
  cancelSubscription(
    @Param('subscriptionId') subscriptionId: string
  ): Promise<SubscriptionResponse> {
    return this.stripeService.cancelSubscription({ subscriptionId });
  }

  @ApiResponse({ type: SubscriptionResponse })
  @Post(':subscriptionId/create-subscription-item')
  createSubscriptionItem(
    @Param('subscriptionId') subscriptionId: string,
    @Body() dto: CreateSubscriptionItemDto
  ): Promise<SubscriptionResponse> {
    return this.stripeService.createSubscriptionItem(subscriptionId, dto);
  }

  @ApiResponse({ type: BaseDataResponse })
  @Get(':subscriptionId/subscription-items')
  listSubscriptionItems(
    @Param('subscriptionId') subscriptionId: string
  ): Promise<BaseDataResponse<Stripe.SubscriptionItem[]>> {
    return this.stripeService.listSubscriptionItems(subscriptionId);
  }

}