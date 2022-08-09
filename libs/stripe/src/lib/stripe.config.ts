import { BaseResponse, PaymentItemDto } from './dto';

export type PaymentMethodType = 
  | 'acss_debit'
  | 'affirm'
  | 'afterpay_clearpay'
  | 'alipay'
  | 'au_becs_debit'
  | 'bacs_debit'
  | 'bancontact'
  | 'boleto'
  | 'card'
  | 'eps'
  | 'fpx'
  | 'giropay'
  | 'grabpay'
  | 'ideal'
  | 'klarna'
  | 'konbini'
  | 'oxxo'
  | 'p24'
  | 'paynow'
  | 'promptpay'
  | 'sepa_debit'
  | 'sofort'
  | 'us_bank_account'
  | 'wechat_pay';

export class StripeConfig {
  apiKey: string;
  webHookSignature?: string;
  successUrl?: string;
  cancelUrl?: string;
  currency?: string;
  paymentMethods?: Array<PaymentMethodType>;
  validateItems?: (items: PaymentItemDto[]) => BaseResponse
}

export const STRIPE_CONFIG = 'STRIPE_CONFIG';
