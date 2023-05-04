import {
  UseGuards,
  UsePipes,
  ValidationPipe,
  Controller,
  Post,
  Body,
  Param
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  CreatePaymentMethodResponse,
  CreatePaymentMethodDto,
  CustomerResponse
} from '../dto';
import { StripeAuthGuard } from '../stripe-auth.guard';
import { StripeService } from '../stripe.service';

@ApiBearerAuth()
@ApiTags('Stripe: Payment Method')
@UseGuards(StripeAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('stripe/payment-method')
export class PaymentMethodController {
  constructor(private stripeService: StripeService) {}

  @ApiResponse({ type: CreatePaymentMethodResponse })
  @Post('create')
  createPaymentMethod(
    @Body() dto: CreatePaymentMethodDto
  ): Promise<CreatePaymentMethodResponse> {
    return this.stripeService.createPaymentMethod(dto);
  }

  @ApiTags('Stripe: Payment Method')
  @Post(':paymentMethodId/detach')
  detachPaymentMethod(
    @Param('paymentMethodId') paymentMethodId: string
  ): Promise<CustomerResponse> {
    return this.stripeService.detachPaymentMethod(paymentMethodId);
  }
}