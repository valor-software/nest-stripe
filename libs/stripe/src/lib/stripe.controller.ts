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
@ApiTags('stripe')
@UseGuards(StripeAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @ApiResponse({ type: CheckoutSessionResponse })
  @ApiTags('Checkout Session')
  @Post('/checkout-session/create')
  createCheckoutSession(@Body() dto: CreateCheckoutSessionDto): Promise<CheckoutSessionResponse> {
    return this.stripeService.createCheckoutSession(dto);
  }

  @ApiResponse({ type: CustomerResponse })
  @ApiTags('Customer')
  @Post('/customer/create')
  createCustomer(@Body() dto: CreateCustomerDto): Promise<CustomerResponse> {
    return this.stripeService.createCustomer(dto);
  }

  @ApiResponse({ type: CustomerResponse })
  @ApiTags('Customer')
  @Post('/customer/:customerId/attach-payment-method/:paymentMethodId')
  attachPaymentMethod(@Param('customerId') customerId: string, @Param('paymentMethodId') paymentMethodId: string): Promise<CustomerResponse> {
    return this.stripeService.attachPaymentMethod(paymentMethodId, customerId);
  }

  @ApiResponse({ type: SubscriptionsResponse })
  @ApiTags('Customer', 'Subscription')
  @Get('/customer/:customerId/subscriptions')
  customerSubscriptions(@Param('customerId') customerId: string): Promise<SubscriptionsResponse> {
    return this.stripeService.customerSubscriptions(customerId);
  }

  @ApiResponse({ type: CustomerResponse })
  @ApiTags('Payment Method')
  @Post('/payment-method/:paymentMethodId/detach')
  detachPaymentMethod(@Param('paymentMethodId') paymentMethodId: string): Promise<CustomerResponse> {
    return this.stripeService.detachPaymentMethod(paymentMethodId);
  }

  @ApiResponse({ type: CreatePaymentMethodResponse })
  @ApiTags('Payment Method')
  @Post('/payment-method/create')
  createPaymentMethod(@Body() dto: CreatePaymentMethodDto): Promise<CreatePaymentMethodResponse> {
    return this.stripeService.createPaymentMethod(dto);
  }

  @ApiResponse({ type: BaseDataResponse })
  @ApiTags('Payment Method')
  @ApiQuery({
    name: 'type',
    enum: PaymentMethodTypes
  })
  @ApiQuery({
    name: 'customerId',
    type: 'string',
    required: false
  })
  @Post('/payment-method-list')
  paymentMethodList(@Query('type') type: any, @Query('customerId') customerId: string): Promise<BaseDataResponse<any[]>> {
    return this.stripeService.paymentMethodList(type, customerId);
  }

  @ApiResponse({ type: PriceResponse })
  @ApiTags('Price')
  @Post('/price/create')
  createPrice(@Body() dto: CreatePriceDto): Promise<PriceResponse> {
    return this.stripeService.createPrice(dto);
  }

  @ApiResponse({ type: SubscriptionResponse })
  @ApiTags('Subscription')
  @Post('/subscription/create')
  createSubscription(@Body() dto: CreateSubscriptionDto): Promise<SubscriptionResponse> {
    return this.stripeService.createSubscription(dto);
  }

  @ApiResponse({ type: SubscriptionResponse })
  @ApiTags('Subscription')
  @Post('/subscription/:subscriptionId/cancel')
  cancelSubscription(@Param() subscriptionId: string): Promise<SubscriptionResponse> {
    return this.stripeService.cancelSubscription({ subscriptionId });
  }

  @ApiResponse({ type: InvoicePreviewResponse })
  @ApiTags('Invoice')
  @Post('/upcoming-invoice-preview')
  upcomingInvoicePreview(@Body() dto: InvoicePreviewDto): Promise<InvoicePreviewResponse> {
    return this.stripeService.upcomingInvoicePreview(dto);
  }

  @ApiResponse({ type: CreateUsageRecordResponse })
  @ApiTags('Usage Record')
  @Post('/usage-record/create/:subscriptionItemId')
  createUsageRecord(@Param('subscriptionItemId') subscriptionItemId: string, @Body() dto: CreateUsageRecordDto): Promise<CreateUsageRecordResponse> {
    return this.stripeService.createUsageRecord(subscriptionItemId, dto);
  }
}
