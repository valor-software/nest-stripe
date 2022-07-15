import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateCustomerResponse } from './dto/create-customer.response';
import { CreatePaymentResponse } from './dto/create-payment.response';
import { StripeAuthGuard } from './stripe-auth.guard';
import { StripeService } from './stripe.service';

@ApiBearerAuth()
@ApiTags('stripe')
@Controller('stripe')
@UseGuards(StripeAuthGuard)
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @ApiResponse({ type: CreatePaymentResponse })
  @Post('/create-checkout-session')
  createCheckoutSession(@Body() dto: CreateCheckoutSessionDto): Promise<CreatePaymentResponse> {
    return this.stripeService.createCheckoutSession(dto);
  }

  @ApiResponse({ type: CreatePaymentResponse })
  @Post('/create-customer')
  createCustomer(@Body() dto: CreateCustomerDto): Promise<CreateCustomerResponse> {
    return this.stripeService.createCustomer(dto);
  }
}
