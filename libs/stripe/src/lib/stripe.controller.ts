import { Body, Controller, Delete, Get, Logger, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  PaymentIntentResponse,
  UpdateSubscriptionDto,
  ProductDto,
  SubscriptionDto,
  InvoiceDto,
  PaymentIntentDto,
  ProductResponse,
  CreateProductDto,
  UpdatePriceDto,
  UpdateProductDto,
  UpdateCustomerDto
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

  //#region Payment Intent
  @ApiResponse({ type: PaymentIntentResponse })
  @ApiTags('Stripe: Payment Intent')
  @Post('/payment-intent/create')
  createPaymentIntent(@Body() dto: CreatePaymentIntentDto): Promise<PaymentIntentResponse> {
    return this.stripeService.createPaymentIntent(dto);
  }

  @ApiResponse({ type: BaseDataResponse })
  @ApiTags('Stripe: Payment Intent')
  @Get('/payment-intent/:paymentIntentId')
  getPaymentIntentById(@Param('paymentIntentId') paymentIntentId: string): Promise<BaseDataResponse<PaymentIntentDto>> {
    return this.stripeService.getPaymentIntentById(paymentIntentId);
  }
  //#endregion

  //#region Checkout session
  @ApiResponse({ type: CheckoutSessionResponse })
  @ApiTags('Stripe: Checkout Session')
  @Post('/checkout-session/create')
  createCheckoutSession(@Body() dto: CreateCheckoutSessionDto): Promise<CheckoutSessionResponse> {
    return this.stripeService.createCheckoutSession(dto);
  }
  //#endregion

  //#region Customer
  @ApiResponse({ type: CustomerResponse })
  @ApiTags('Stripe: Customer')
  @Post('/customer/create')
  createCustomer(@Body() dto: CreateCustomerDto): Promise<CustomerResponse> {
    return this.stripeService.createCustomer(dto);
  }

  @ApiResponse({ type: CustomerResponse })
  @ApiTags('Stripe: Customer')
  @Post('/customer/:customerId/update')
  updateCustomer(@Param('customerId') customerId: string, @Body() dto: UpdateCustomerDto): Promise<CustomerResponse> {
    return this.stripeService.updateCustomer(customerId, dto);
  }

  @ApiResponse({ type: CustomerResponse })
  @ApiQuery({
    name: 'useAsDefault',
    type: Boolean,
    required: false
  })
  @ApiTags('Stripe: Customer')
  @Post('/customer/:customerId/attach-payment-method/:paymentMethodId')
  attachPaymentMethod(
    @Param('customerId') customerId: string,
    @Param('paymentMethodId')  paymentMethodId: string,
    @Query('useAsDefault') useAsDefault?: string
  ): Promise<CustomerResponse> {
    return this.stripeService.attachPaymentMethod(paymentMethodId, customerId, Boolean(useAsDefault));
  }

  @ApiResponse({ type: BaseDataResponse })
  @ApiTags('Stripe: Customer')
  @Get('/customer/:customerId')
  getCustomer(@Param('customerId') customerId: string): Promise<BaseDataResponse<any>> {
    return this.stripeService.getCustomer(customerId);
  }

  @ApiResponse({ type: BaseDataResponse })
  @ApiTags('Stripe: Customer')
  @Get('/customer/:email/by-email')
  getCustomerByEmail(@Param('email') email: string): Promise<BaseDataResponse<any[]>> {
    return this.stripeService.getCustomersByEmail(email);
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

  //#region Payment Method
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
  //#endregion

  //#region Price
  @ApiResponse({ type: PriceResponse })
  @ApiTags('Stripe: Price')
  @Post('/price/create')
  createPrice(@Body() dto: CreatePriceDto): Promise<PriceResponse> {
    return this.stripeService.createPrice(dto);
  }

  @ApiResponse({ type: PriceResponse })
  @ApiTags('Stripe: Price')
  @Post('/price/:priceId/update')
  updatePrice(@Param('priceId') priceId: string, @Body() dto: UpdatePriceDto): Promise<PriceResponse> {
    return this.stripeService.updatePrice(priceId, dto);
  }

  @ApiResponse({ type: BaseDataResponse })
  @ApiTags('Stripe: Price')
  @Get('/price')
  priceList(): Promise<BaseDataResponse<PriceDto[]>> {
    return this.stripeService.getPriceList();
  }

  @ApiResponse({ type: BaseDataResponse<PriceDto> })
  @ApiTags('Stripe: Price')
  @Get('/price/:priceId')
  priceById(@Param('priceId') priceId: string): Promise<BaseDataResponse<PriceDto>> {
    return this.stripeService.getPriceById(priceId);
  }
  //#endregion

  //#region Product
  @ApiResponse({ type: ProductResponse })
  @ApiTags('Stripe: Product')
  @Post('/product/create')
  createProduct(@Body() dto: CreateProductDto): Promise<ProductResponse> {
    return this.stripeService.createProduct(dto);
  }

  @ApiResponse({ type: ProductResponse })
  @ApiTags('Stripe: Product')
  @Post('/product/:productId/update')
  updateProduct(@Param('productId') productId: string, @Body() dto: UpdateProductDto): Promise<ProductResponse> {
    return this.stripeService.updateProduct(productId, dto);
  }

  @ApiResponse({ type: ProductResponse })
  @ApiTags('Stripe: Product')
  @Delete('/product/:productId/delete')
  deleteProduct(@Param('productId') productId: string): Promise<ProductResponse> {
    return this.stripeService.deleteProduct(productId);
  }

  @ApiResponse({ type: BaseDataResponse })
  @ApiTags('Stripe: Product')
  @Get('/product')
  productList(): Promise<BaseDataResponse<ProductDto[]>> {
    return this.stripeService.getProductList();
  }

  @ApiResponse({ type: BaseDataResponse<ProductDto> })
  @ApiTags('Stripe: Product')
  @Get('/product/:productId')
  productById(@Param('productId') productId: string): Promise<BaseDataResponse<ProductDto>> {
    return this.stripeService.getProductById(productId);
  }
  //#endregion

  //#region Subscription
  @ApiResponse({ type: SubscriptionResponse })
  @ApiTags('Stripe: Subscription')
  @Post('/subscription/create')
  createSubscription(@Body() dto: CreateSubscriptionDto): Promise<SubscriptionResponse> {
    return this.stripeService.createSubscription(dto);
  }

  @ApiResponse({ type: BaseDataResponse<SubscriptionDto> })
  @ApiTags('Stripe: Subscription')
  @Get('/subscription/:subscriptionId')
  getSubscriptionById(@Param('subscriptionId') subscriptionId: string): Promise<BaseDataResponse<SubscriptionDto>> {
    return this.stripeService.getSubscriptionById(subscriptionId);
  }

  @ApiResponse({ type: SubscriptionResponse })
  @ApiTags('Stripe: Subscription')
  @Post('/subscription/:subscriptionId/update')
  updateSubscription(@Param('subscriptionId') subscriptionId: string, @Body() dto: UpdateSubscriptionDto): Promise<SubscriptionResponse> {
    return this.stripeService.updateSubscription(subscriptionId, dto);
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

  //#region Invoice
  @ApiResponse({ type: BaseDataResponse<InvoiceDto> })
  @ApiTags('Stripe: Invoice')
  @Get('/invoice/:invoiceId')
  getInvoiceById(@Param('invoiceId') invoiceId: string): Promise<BaseDataResponse<InvoiceDto>> {
    return this.stripeService.getInvoiceById(invoiceId);
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
  @Post('/quote/:quoteId/update')
  updateQuote(@Param('quoteId') quoteId: string, @Body() dto: SaveQuoteDto): Promise<SaveQuoteResponse> {
    return this.stripeService.updateQuote(quoteId, dto);
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
