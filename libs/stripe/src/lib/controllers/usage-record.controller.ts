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
  CreateUsageRecordDto,
  CreateUsageRecordResponse
} from '../dto';
import { StripeAuthGuard } from '../stripe-auth.guard';
import { StripeService } from '../stripe.service';
import Stripe from 'stripe';

@ApiBearerAuth()
@ApiTags('Stripe: Usage Record')
@UseGuards(StripeAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('stripe/usage-record')
export class UsageRecordController {
  constructor(private stripeService: StripeService) {}

  @ApiResponse({ type: CreateUsageRecordResponse })
  @Post('create/:subscriptionItemId')
  createUsageRecord(
    @Param('subscriptionItemId') subscriptionItemId: string,
    @Body() dto: CreateUsageRecordDto
  ): Promise<CreateUsageRecordResponse> {
    return this.stripeService.createUsageRecord(subscriptionItemId, dto);
  }

  @ApiResponse({ type: BaseDataResponse })
  @Get(':subscriptionItemId/usage-record-summaries')
  listUsageRecordSummaries(
    @Param('subscriptionItemId') subscriptionItemId: string
  ): Promise<BaseDataResponse<Stripe.UsageRecordSummary[]>> {
    return this.stripeService.listUsageRecordSummaries(subscriptionItemId);
  }

}