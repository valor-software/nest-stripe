import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CancelSubscriptionDto,
  CheckoutSessionResponse,
  CreateCheckoutSessionDto,
  CreateCustomerDto,
  CreatePriceDto,
  CreateSubscriptionDto,
  CustomerResponse,
  InvoicePreviewDto,
  InvoicePreviewResponse,
  PriceResponse,
  SubscriptionResponse,
  SubscriptionsResponse
} from './dto';
import { StripeAuthGuard } from './stripe-auth.guard';
import { StripeService } from './stripe.service';

@ApiBearerAuth()
@ApiTags('stripe')
@UseGuards(StripeAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @ApiResponse({ type: CheckoutSessionResponse })
  @Post('/create-checkout-session')
  createCheckoutSession(@Body() dto: CreateCheckoutSessionDto): Promise<CheckoutSessionResponse> {
    return this.stripeService.createCheckoutSession(dto);
  }

  @ApiResponse({ type: CustomerResponse })
  @Post('/create-customer')
  createCustomer(@Body() dto: CreateCustomerDto): Promise<CustomerResponse> {
    return this.stripeService.createCustomer(dto);
  }

  @ApiResponse({ type: PriceResponse })
  @Post('/create-price')
  createPrice(@Body() dto: CreatePriceDto): Promise<PriceResponse> {
    return this.stripeService.createPrice(dto);
  }

  @ApiResponse({ type: SubscriptionResponse })
  @Post('/create-subscription')
  createSubscription(@Body() dto: CreateSubscriptionDto): Promise<SubscriptionResponse> {
    return this.stripeService.createSubscription(dto);
  }

  @ApiResponse({ type: SubscriptionsResponse })
  @ApiQuery({
    name: 'customerId',
    type: 'string'
  })
  @Get('/customer-subscriptions')
  customerSubscriptions(@Query('customerId') customerId: string): Promise<SubscriptionsResponse> {
    return this.stripeService.customerSubscriptions(customerId);
  }

  @ApiResponse({ type: SubscriptionResponse })
  @Post('/cancel-subscription')
  cancelSubscription(@Body() dto: CancelSubscriptionDto): Promise<SubscriptionResponse> {
    return this.stripeService.cancelSubscription(dto);
  }

  @ApiResponse({ type: InvoicePreviewResponse })
  @Post('/invoice-preview')
  invoicePreview(@Body() dto: InvoicePreviewDto): Promise<InvoicePreviewResponse> {
    return this.stripeService.invoicePreview(dto);
  }
}
