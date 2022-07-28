import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Stripe from 'stripe';
import { BaseDto } from '../base.dto';
import { AddressDto } from '../shared.dto';

export class PaymentIntentShippingDto {
  @ApiPropertyOptional()
  address?: AddressDto;
  
  @ApiPropertyOptional({
    description: 'The delivery service that shipped a physical product, such as Fedex, UPS, USPS, etc.'
  })
  carrier?: string | null;
  
  @ApiPropertyOptional({ description: 'Recipient name.' })
  name?: string;
  
  @ApiPropertyOptional({ description: 'Recipient phone (including extension).' })
  phone?: string | null;
  
  @ApiPropertyOptional({
    description: 'The tracking number for a physical product, obtained from the delivery service. If multiple tracking numbers were generated for this purchase, please separate them with commas.'
  })
  trackingNumber?: string | null;
}

export class PaymentIntentDto extends BaseDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  amountCapturable: number;

  @ApiPropertyOptional()
  amountTip?: number;

  @ApiProperty()
  amountReceived: number;

  @ApiProperty()
  application: string;

  @ApiProperty()
  applicationFeeAmount: number;

  @ApiProperty()
  automaticPaymentMethodsEnabled: boolean;

  @ApiProperty()
  canceledAt: number | null;

  @ApiProperty({
    enum: ['abandoned', 'automatic', 'duplicate', 'failed_invoice', 'fraudulent', 'requested_by_customer', 'void_invoice']
  })
  cancellationReason: Stripe.PaymentIntent.CancellationReason | null;

  @ApiProperty({
    enum: ['automatic', 'manual']
  })
  captureMethod: Stripe.PaymentIntent.CaptureMethod;

  @ApiProperty({
    description: 'The client secret of this PaymentIntent. Used for client-side retrieval using a publishable key.'
    + 'The client secret can be used to complete a payment from your frontend. It should not be stored, logged, or exposed to anyone other than the customer. Make sure that you have TLS enabled on any page that includes the client secret.'
    + 'Refer to our docs to [accept a payment](https://stripe.com/docs/payments/accept-a-payment?ui=elements) and learn about how `client_secret` should be handled.'
  })
  clientSecret: string | null;

  @ApiProperty({
    enum: ['automatic', 'manual']
  })
  confirmationMethod: Stripe.PaymentIntent.ConfirmationMethod;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  customer: string | null;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  invoice: string | null;

  @ApiProperty()
  lastPaymentError: Stripe.PaymentIntent.LastPaymentError | null;

  @ApiProperty({
    description: 'If present, this property tells you what actions you need to take in order for your customer to fulfill a payment using the provided source.'
  })
  nextAction: Stripe.PaymentIntent.NextAction | null;

  @ApiProperty({
    description: 'The account (if any) for which the funds of the PaymentIntent are intended. See the PaymentIntents [use case for connected accounts](https://stripe.com/docs/payments/connected-accounts) for details.'
  })
  onBehalfOf: string | Stripe.Account | null;

  @ApiProperty()
  paymentMethod: string | null;

  @ApiProperty()
  paymentMethodOptions: Stripe.PaymentIntent.PaymentMethodOptions | null;

  @ApiProperty({
    isArray: true,
    type: String
  })
  paymentMethodTypes: Array<string>;

  @ApiProperty({
    description: 'If present, this property tells you about the processing state of the payment.'
  })
  processing: Stripe.PaymentIntent.Processing | null;

  @ApiProperty()
  receiptEmail: string | null;

  @ApiProperty()
  review: string | null;

  @ApiProperty({
    description: 'Indicates that you intend to make future payments with this PaymentIntent\'s payment method.'
      + 'Providing this parameter will [attach the payment method](https://stripe.com/docs/payments/save-during-payment) to the PaymentIntent\'s Customer, if present, after the PaymentIntent is confirmed and any required actions from the user are complete. If no Customer was provided, the payment method can still be [attached](https://stripe.com/docs/api/payment_methods/attach) to a Customer after the transaction completes.'
      + 'When processing card payments, Stripe also uses `setup_future_usage` to dynamically optimize your payment flow and comply with regional legislation and network rules, such as [SCA](https://stripe.com/docs/strong-customer-authentication).',
    enum: ['off_session', 'on_session']
  })
  setupFutureUsage: Stripe.PaymentIntent.SetupFutureUsage | null;

  @ApiProperty()
  shipping: PaymentIntentShippingDto | null;

  @ApiProperty({
    description: 'For non-card charges, you can use this value as the complete description that appears on your customer\'s statements. Must contain at least one letter, maximum 22 characters.'
  })
  statementDescriptor: string | null;

  @ApiProperty({
    description: 'Provides information about a card payment that customers see on their statements. Concatenated with the prefix (shortened descriptor) or statement descriptor that\'s set on the account to form the complete statement descriptor. Maximum 22 characters for the concatenated descriptor.'
  })
  statementDescriptorSuffix: string | null;

  @ApiProperty({
    description: 'Status of this PaymentIntent, one of `requires_payment_method`, `requires_confirmation`, `requires_action`, `processing`, `requires_capture`, `canceled`, or `succeeded`. Read more about each PaymentIntent [status](https://stripe.com/docs/payments/intents#intent-statuses).',
    enum: ['canceled', 'processing', 'requires_action', 'requires_capture', 'requires_confirmation', 'requires_payment_method', 'succeeded']
  })
  status: Stripe.PaymentIntent.Status;

}
