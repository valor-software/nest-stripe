import { Body, Controller, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import Stripe from 'stripe';
import {
  BaseDataResponse,
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
  InvoicePreviewResponse,
  PaymentMethodTypes,
  PriceResponse,
  SubscriptionResponse,
  SubscriptionsResponse,
  CreateSubscriptionItemDto,
  PriceDto,
  CreatePaymentIntentDto,
  PaymentIntentResponse
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

  @ApiResponse({ type: PaymentIntentResponse })
  @ApiTags('Stripe: Payment Intent')
  @Post('/payment-intent/create')
  createPaymentIntent(@Body() dto: CreatePaymentIntentDto): Promise<PaymentIntentResponse> {
    return this.stripeService.createPaymentIntent(dto);
  }

  @ApiResponse({ type: CheckoutSessionResponse })
  @ApiTags('Stripe: Checkout Session')
  @Post('/checkout-session/create')
  createCheckoutSession(@Body() dto: CreateCheckoutSessionDto): Promise<CheckoutSessionResponse> {
    return this.stripeService.createCheckoutSession(dto);
  }

  //#region Customer
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

  @ApiResponse({ type: BaseDataResponse })
  @ApiTags('Stripe: Customer')
  @Get('/customer/:customerId')
  getCustomer(@Param('customerId') customerId: string): Promise<BaseDataResponse<any>> {
    return this.stripeService.getCustomer(customerId);
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
    return this.stripeService.customerPaymentMethodList(customerId, type);
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

  @ApiResponse({ type: SubscriptionsResponse })
  @ApiTags('Stripe: Customer')
  @ApiQuery({
    name: 'status',
    enum: ['accepted', 'canceled', 'draft', 'open'],
    required: false
  })
  @Get('/customer/:customerId/quotes')
  customerQuotes(@Param('customerId') customerId: string, @Query('status') status?: Stripe.Quote.Status): Promise<SubscriptionsResponse> {
    return this.stripeService.customerQuoteList(customerId, status);
  }
  //#endregion

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

  @ApiResponse({ type: BaseDataResponse })
  @ApiTags('Stripe: Price')
  @Get('/price')
  priceList(): Promise<BaseDataResponse<PriceDto[]>> {
    return this.stripeService.getPriceList();
  }

  //#region Subscription
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

  @ApiResponse({ type: SubscriptionResponse })
  @ApiTags('Stripe: Subscription')
  @Post('/subscription/:subscriptionId/create-subscription-item')
  createSubscriptionItem(@Param('subscriptionId') subscriptionId: string, @Body() dto: CreateSubscriptionItemDto): Promise<SubscriptionResponse> {
    return this.stripeService.createSubscriptionItem(subscriptionId, dto);
  }

  @ApiResponse({ type: BaseDataResponse })
  @ApiTags('Stripe: Subscription')
  @Get('/subscription/:subscriptionId/subscription-items')
  listSubscriptionItems(@Param('subscriptionId') subscriptionId: string): Promise<BaseDataResponse<any>> {
    return this.stripeService.listSubscriptionItems(subscriptionId);
  }
  //#endregion

  //#region Usage Record
  @ApiResponse({ type: CreateUsageRecordResponse })
  @ApiTags('Stripe: Usage Record')
  @Post('/usage-record/create/:subscriptionItemId')
  createUsageRecord(@Param('subscriptionItemId') subscriptionItemId: string, @Body() dto: CreateUsageRecordDto): Promise<CreateUsageRecordResponse> {
    return this.stripeService.createUsageRecord(subscriptionItemId, dto);
  }

  @ApiResponse({ type: BaseDataResponse })
  @ApiTags('Stripe: Usage Record')
  @Get('/usage-record/:subscriptionItemId/usage-record-summaries')
  listUsageRecordSummaries(@Param('subscriptionItemId') subscriptionItemId: string): Promise<BaseDataResponse<any>> {
    return this.stripeService.listUsageRecordSummaries(subscriptionItemId);
  }
  //#endregion

  //#region Quote
  @ApiResponse({ type: SaveQuoteResponse })
  @ApiTags('Stripe: Quote')
  @Post('/quote/create')
  createQuote(@Body() dto: SaveQuoteDto): Promise<SaveQuoteResponse> {
    return this.stripeService.createQuote(dto);
  }

  @ApiResponse({ type: SaveQuoteResponse })
  @ApiTags('Stripe: Quote')
  @Post('/quote/:quoteId/accept')
  acceptQuote(@Param('quoteId') quoteId: string): Promise<SaveQuoteResponse> {
    return this.stripeService.acceptQuote(quoteId);
  }

  @ApiResponse({ type: SaveQuoteResponse })
  @ApiTags('Stripe: Quote')
  @Post('/quote/:quoteId/cancel')
  cancelQuote(@Param('quoteId') quoteId: string): Promise<SaveQuoteResponse> {
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
  finalizeQuote(@Param('quoteId') quoteId: string, @Query('expiredAt') expiredAt?: number): Promise<SaveQuoteResponse> {
    return this.stripeService.finalizeQuote(quoteId, expiredAt);
  }
  //#endregion
}
