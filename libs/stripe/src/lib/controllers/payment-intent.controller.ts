import {
  UseGuards,
  UsePipes,
  ValidationPipe,
  Controller,
  Post,
  Body,
  Get,
  Param
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  PaymentIntentResponse,
  CreatePaymentIntentDto,
  BaseDataResponse,
  PaymentIntentDto
} from '../dto';
import { StripeAuthGuard } from '../stripe-auth.guard';
import { StripeService } from '../stripe.service';

@ApiBearerAuth()
@ApiTags('Stripe: Payment Intent')
@UseGuards(StripeAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('stripe/payment-intent')
export class PaymentIntentController {
  constructor(private stripeService: StripeService) {}

  @ApiResponse({ type: PaymentIntentResponse })
  @Post('create')
  createPaymentIntent(
    @Body() dto: CreatePaymentIntentDto
  ): Promise<PaymentIntentResponse> {
    return this.stripeService.createPaymentIntent(dto);
  }

  @ApiResponse({ type: BaseDataResponse })
  @Get(':paymentIntentId')
  getPaymentIntentById(
    @Param('paymentIntentId') paymentIntentId: string
  ): Promise<BaseDataResponse<PaymentIntentDto>> {
    return this.stripeService.getPaymentIntentById(paymentIntentId);
  }
}