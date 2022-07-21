import { Body, Controller, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BaseDataResponse,
  CancelSubscriptionDto,
  CheckoutSessionResponse,
  CreateCheckoutSessionDto,
  CreateCustomerDto,
  CreatePaymentMethodDto,
  CreatePaymentMethodResponse,
  CreatePriceDto,
  SaveQuoteDto,
  SaveQuoteResponse,
  CreateSubscriptionDto,
  CreateUsageRecordDto,
  CreateUsageRecordResponse,
  CustomerResponse,
  InvoicePreviewDto,
  InvoicePreviewResponse,
  PaymentMethodTypes,
  PriceResponse,
  SubscriptionResponse,
  SubscriptionsResponse
} from './dto';
import { StripeAuthGuard } from './stripe-auth.guard';
import { StripeService } from './stripe.service';

@ApiBearerAuth()
//@ApiTags('stripe')
@UseGuards(StripeAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @ApiResponse({ type: CheckoutSessionResponse })
  @ApiTags('Stripe: Checkout Session')
  @Post('/checkout-session/create')
  createCheckoutSession(@Body() dto: CreateCheckoutSessionDto): Promise<CheckoutSessionResponse> {
    return this.stripeService.createCheckoutSession(dto);
  }

  @ApiResponse({ type: CustomerResponse })
  @ApiTags('Stripe: Customer')
  @Post('/customer/create')
  createCustomer(@Body() dto: CreateCustomerDto): Promise<CustomerResponse> {
    return this.stripeService.createCustomer(dto);
  }

  @ApiResponse({ type: CustomerResponse })
  @ApiTags('Stripe: Customer')
  @Post('/customer/:customerId/attach-payment-method/:paymentMethodId')
  attachPaymentMethod(@Param('customerId') customerId: string, @Param('paymentMethodId') paymentMethodId: string): Promise<CustomerResponse> {
    return this.stripeService.attachPaymentMethod(paymentMethodId, customerId);
  }

  @ApiResponse({ type: SubscriptionsResponse })
  @ApiTags('Stripe: Customer')
  @Get('/customer/:customerId/subscriptions')
  customerSubscriptions(@Param('customerId') customerId: string): Promise<SubscriptionsResponse> {
    return this.stripeService.customerSubscriptions(customerId);
  }

  @ApiResponse({ type: BaseDataResponse })
  @ApiTags('Stripe: Customer')
  @ApiQuery({
    name: 'type',
    enum: PaymentMethodTypes
  })
  @Get('/customer/:customerId/payment-method-list')
  customerPaymentMethodList(@Param('customerId') customerId: string, @Query('type') type: any): Promise<BaseDataResponse<any[]>> {
    return this.stripeService.paymentMethodList(type, customerId);
  }

  @ApiResponse({ type: InvoicePreviewResponse })
  @ApiTags('Stripe: Customer')
  @Get('/customer/:customerId/upcoming-invoice-preview/:subscriptionId')
  customerUpcomingInvoicePreview(@Param('customerId') customerId: string, @Param('subscriptionId') subscriptionId: string): Promise<InvoicePreviewResponse> {
    return this.stripeService.upcomingInvoicePreview({
      customerId,
      subscriptionId
    });
  }

  @ApiResponse({ type: CreatePaymentMethodResponse })
  @ApiTags('Stripe: Payment Method')
  @Post('/payment-method/create')
  createPaymentMethod(@Body() dto: CreatePaymentMethodDto): Promise<CreatePaymentMethodResponse> {
    return this.stripeService.createPaymentMethod(dto);
  }

  @ApiResponse({ type: CustomerResponse })
  @ApiTags('Stripe: Payment Method')
  @Post('/payment-method/:paymentMethodId/detach')
  detachPaymentMethod(@Param('paymentMethodId') paymentMethodId: string): Promise<CustomerResponse> {
    return this.stripeService.detachPaymentMethod(paymentMethodId);
  }

  @ApiResponse({ type: PriceResponse })
  @ApiTags('Stripe: Price')
  @Post('/price/create')
  createPrice(@Body() dto: CreatePriceDto): Promise<PriceResponse> {
    return this.stripeService.createPrice(dto);
  }

  @ApiResponse({ type: SubscriptionResponse })
  @ApiTags('Stripe: Subscription')
  @Post('/subscription/create')
  createSubscription(@Body() dto: CreateSubscriptionDto): Promise<SubscriptionResponse> {
    return this.stripeService.createSubscription(dto);
  }

  @ApiResponse({ type: SubscriptionResponse })
  @ApiTags('Stripe: Subscription')
  @Post('/subscription/:subscriptionId/cancel')
  cancelSubscription(@Param() subscriptionId: string): Promise<SubscriptionResponse> {
    return this.stripeService.cancelSubscription({ subscriptionId });
  }

  @ApiResponse({ type: CreateUsageRecordResponse })
  @ApiTags('Stripe: Usage Record')
  @Post('/usage-record/create/:subscriptionItemId')
  createUsageRecord(@Param('subscriptionItemId') subscriptionItemId: string, @Body() dto: CreateUsageRecordDto): Promise<CreateUsageRecordResponse> {
    return this.stripeService.createUsageRecord(subscriptionItemId, dto);
  }

  @ApiResponse({ type: SaveQuoteResponse })
  @ApiTags('Stripe: Quote')
  @Post('/quote/create')
  createQuote(@Body() dto: SaveQuoteDto): Promise<SaveQuoteResponse> {
    return this.stripeService.createQuote(dto);
  }

  @ApiResponse({ type: SaveQuoteResponse })
  @ApiTags('Stripe: Quote')
  @Post('/quote/:quoteId/accept')
  acceptQuote(@Param() quoteId: string): Promise<SaveQuoteResponse> {
    return this.stripeService.acceptQuote(quoteId);
  }

  @ApiResponse({ type: SaveQuoteResponse })
  @ApiTags('Stripe: Quote')
  @Post('/quote/:quoteId/cancel')
  cancelQuote(@Param() quoteId: string): Promise<SaveQuoteResponse> {
    return this.stripeService.cancelQuote(quoteId);
  }

  @ApiResponse({ type: SaveQuoteResponse })
  @ApiTags('Stripe: Quote')
  @ApiQuery({
    name: 'expiredAt',
    type: 'number',
    required: false
  })
  @Post('/quote/:quoteId/finalize')
  finalizeQuote(@Param() quoteId: string, @Query() expiredAt?: number): Promise<SaveQuoteResponse> {
    return this.stripeService.finalizeQuote(quoteId, expiredAt);
  }
}
