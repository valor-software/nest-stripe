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
  @Post('/create-checkout-session')
  createCheckoutSession(@Body() dto: CreateCheckoutSessionDto): Promise<CheckoutSessionResponse> {
    return this.stripeService.createCheckoutSession(dto);
  }

  @ApiResponse({ type: CustomerResponse })
  @Post('/create-customer')
  createCustomer(@Body() dto: CreateCustomerDto): Promise<CustomerResponse> {
    return this.stripeService.createCustomer(dto);
  }

  @ApiResponse({ type: CustomerResponse })
  @Post('/customer/:customerId/attach-payment-method/:paymentMethodId')
  attachPaymentMethod(@Param('customerId') customerId: string, @Param('paymentMethodId') paymentMethodId: string): Promise<CustomerResponse> {
    return this.stripeService.attachPaymentMethod(paymentMethodId, customerId);
  }

  @ApiResponse({ type: CustomerResponse })
  @Post('/payment-method/:paymentMethodId/detach')
  detachPaymentMethod(@Param('paymentMethodId') paymentMethodId: string): Promise<CustomerResponse> {
    return this.stripeService.detachPaymentMethod(paymentMethodId);
  }

  @ApiResponse({ type: CreatePaymentMethodResponse })
  @Post('/create-payment-method')
  createPaymentMethod(@Body() dto: CreatePaymentMethodDto): Promise<CreatePaymentMethodResponse> {
    return this.stripeService.createPaymentMethod(dto);
  }

  @ApiResponse({ type: BaseDataResponse })
  @ApiQuery({
    name: 'type',
    enum: PaymentMethodTypes
  })
  @ApiQuery({
    name: 'customerId',
    type: 'string',
    required: false
  })
  @Post('/paymentMethods')
  paymentMethodList(@Query('type') type: any, @Query('customerId') customerId: string): Promise<BaseDataResponse<any[]>> {
    return this.stripeService.paymentMethodList(type, customerId);
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
  @Get('/customer/:customerId/subscriptions')
  customerSubscriptions(@Param('customerId') customerId: string): Promise<SubscriptionsResponse> {
    return this.stripeService.customerSubscriptions(customerId);
  }

  @ApiResponse({ type: SubscriptionResponse })
  @Post('/cancel-subscription')
  cancelSubscription(@Body() dto: CancelSubscriptionDto): Promise<SubscriptionResponse> {
    return this.stripeService.cancelSubscription(dto);
  }

  @ApiResponse({ type: InvoicePreviewResponse })
  @Post('/upcoming-invoice-preview')
  upcomingInvoicePreview(@Body() dto: InvoicePreviewDto): Promise<InvoicePreviewResponse> {
    return this.stripeService.upcomingInvoicePreview(dto);
  }

  @ApiResponse({ type: CreateUsageRecordResponse })
  @Post('/create-usage-record/:subscriptionItemId')
  createUsageRecord(@Param('subscriptionItemId') subscriptionItemId: string, @Body() dto: CreateUsageRecordDto): Promise<CreateUsageRecordResponse> {
    return this.stripeService.createUsageRecord(subscriptionItemId, dto);
  }
}
