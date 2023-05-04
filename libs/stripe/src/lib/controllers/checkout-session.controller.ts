import {
  UseGuards,
  UsePipes,
  ValidationPipe,
  Controller,
  Post,
  Body
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  CheckoutSessionResponse,
  CreateCheckoutSessionDto
} from '../dto';
import { StripeAuthGuard } from '../stripe-auth.guard';
import { StripeService } from '../stripe.service';

@ApiBearerAuth()
@ApiTags('Stripe: Checkout Session')
@UseGuards(StripeAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('stripe/checkout-session')
export class CheckoutSessionController {
  constructor(private stripeService: StripeService) {}

  @ApiResponse({ type: CheckoutSessionResponse })
  @Post('create')
  createCheckoutSession(
    @Body() dto: CreateCheckoutSessionDto
  ): Promise<CheckoutSessionResponse> {
    return this.stripeService.createCheckoutSession(dto);
  }
}