import { ApiPropertyOptional } from '@nestjs/swagger';
import Stripe from 'stripe';
import { BaseDto } from '../base.dto';
import { AddressDto, CustomFieldDto } from '../shared.dto';

export class CustomerInvoiceSettingsDto {
  @ApiPropertyOptional({
    description: 'Default custom fields to be displayed on invoices for this customer.',
    isArray: true,
    type: CustomFieldDto
  })
  customFields: Array<CustomFieldDto> | null;
  
  @ApiPropertyOptional({
    description: 'ID of a payment method that\'s attached to the customer, to be used as the customer\'s default payment method for subscriptions and invoices.'
  })
  defaultPaymentMethod: string | Stripe.PaymentMethod | null;
  
  @ApiPropertyOptional({
    description: 'Default footer to be displayed on invoices for this customer.'
  })
  footer: string | null;

}

export class CustomerDto extends BaseDto {
  @ApiPropertyOptional()
  address?: AddressDto | null;

  @ApiPropertyOptional()
  balance: number;
  
  @ApiPropertyOptional()
  currency: string | null;

  @ApiPropertyOptional()
  defaultSource: string | null;
  
  @ApiPropertyOptional({
    description: 'When the customer\'s latest invoice is billed by charging automatically, `delinquent` is `true` if the invoice\'s latest charge failed. When the customer\'s latest invoice is billed by sending an invoice, `delinquent` is `true` if the invoice isn\'t paid by its due date.'
    + 'If an invoice is marked uncollectible by [dunning](https://stripe.com/docs/billing/automatic-collection), `delinquent` doesn\'t get reset to `false`.'
  })
  delinquent: boolean | null;

  @ApiPropertyOptional()
  description: string | null;
      
  @ApiPropertyOptional()
  discount: Stripe.Discount | null;

  @ApiPropertyOptional()
  email: string | null;
  
  @ApiPropertyOptional({ description: 'The prefix for the customer used to generate unique invoice numbers.' })
  invoicePrefix: string | null;
  
  @ApiPropertyOptional()
  invoiceSettings: CustomerInvoiceSettingsDto;
  
  @ApiPropertyOptional()
  name: string | null;
  
  @ApiPropertyOptional({
    description: 'The suffix of the customer\'s next invoice number, e.g., 0001.'
  })
  nextInvoiceSequence?: number;

  @ApiPropertyOptional()
  phone: string | null;
  
  @ApiPropertyOptional({
    isArray: true,
    type: String
  })
  preferredLocales: Array<string> | null;

}
