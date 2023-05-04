import {
  UseGuards,
  UsePipes,
  ValidationPipe,
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {
  BaseDataResponse,
  CreateCustomerDto,
  CustomerDto,
  CustomerResponse,
  PaymentMethodDto,
  PaymentMethodTypes,
  SubscriptionsResponse,
  UpdateCustomerDto
} from '../dto';
import { StripeAuthGuard } from '../stripe-auth.guard';
import { StripeService } from '../stripe.service';
import Stripe from 'stripe';

@ApiBearerAuth()
@ApiTags('Stripe: Customer')
@UseGuards(StripeAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('stripe/customer')
export class CustomerController {
  constructor(private stripeService: StripeService) {}

  @ApiResponse({ type: CustomerResponse })
  @Post('create')
  createCustomer(@Body() dto: CreateCustomerDto): Promise<CustomerResponse> {
    return this.stripeService.createCustomer(dto);
  }

  @ApiResponse({ type: CustomerResponse })
  @Post(':customerId/update')
  updateCustomer(
    @Param('customerId') customerId: string,
    @Body() dto: UpdateCustomerDto
  ): Promise<CustomerResponse> {
    return this.stripeService.updateCustomer(customerId, dto);
  }

  @ApiResponse({ type: CustomerResponse })
  @ApiQuery({
    name: 'useAsDefault',
    type: Boolean,
    required: false
  })
  @Post(':customerId/attach-payment-method/:paymentMethodId')
  attachPaymentMethod(
    @Param('customerId') customerId: string,
    @Param('paymentMethodId')  paymentMethodId: string,
    @Query('useAsDefault') useAsDefault?: string
  ): Promise<CustomerResponse> {
    return this.stripeService.attachPaymentMethod(paymentMethodId, customerId, Boolean(useAsDefault));
  }

  @ApiResponse({ type: BaseDataResponse })
  @Get(':customerId')
  getCustomer(@Param('customerId') customerId: string): Promise<BaseDataResponse<CustomerDto>> {
    return this.stripeService.getCustomer(customerId);
  }

  @ApiResponse({ type: BaseDataResponse })
  @Get(':email/by-email')
  getCustomerByEmail(@Param('email') email: string): Promise<BaseDataResponse<CustomerDto[]>> {
    return this.stripeService.getCustomersByEmail(email);
  }

  @ApiResponse({ type: SubscriptionsResponse })
  @Get(':customerId/subscriptions')
  customerSubscriptions(@Param('customerId') customerId: string): Promise<SubscriptionsResponse> {
    return this.stripeService.customerSubscriptions(customerId);
  }

  @ApiResponse({ type: BaseDataResponse })
  @ApiQuery({
    name: 'type',
    enum: PaymentMethodTypes
  })
  @Get(':customerId/payment-method-list')
  customerPaymentMethodList(
    @Param('customerId') customerId: string,
    @Query('type') type: Stripe.PaymentMethodListParams.Type): Promise<BaseDataResponse<PaymentMethodDto[]>> {
    return this.stripeService.customerPaymentMethodList(customerId, type);
  }

  @ApiResponse({ type: SubscriptionsResponse })
  @ApiQuery({
    name: 'status',
    enum: ['accepted', 'canceled', 'draft', 'open'],
    required: false
  })
  @Get(':customerId/quotes')
  customerQuotes(
    @Param('customerId') customerId: string,
    @Query('status') status?: Stripe.Quote.Status
  ): Promise<SubscriptionsResponse> {
    return this.stripeService.customerQuoteList(customerId, status);
  }
}