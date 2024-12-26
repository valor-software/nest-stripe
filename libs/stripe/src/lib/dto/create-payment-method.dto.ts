import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsPositive, Max, Min } from 'class-validator';
import Stripe from 'stripe';
import { BillingDetailsAddressDto } from './shared.dto';

export const PaymentMethodTypes = [
    'acss_debit'
  , 'affirm'
  , 'afterpay_clearpay'
  , 'alipay'
  , 'au_becs_debit'
  , 'bacs_debit'
  , 'bancontact'
  , 'boleto'
  , 'card'
  , 'customer_balance'
  , 'eps'
  , 'fpx'
  , 'giropay'
  , 'grabpay'
  , 'ideal'
  , 'klarna'
  , 'konbini'
  , 'link'
  , 'oxxo'
  , 'p24'
  , 'paynow'
  , 'promptpay'
  , 'sepa_debit'
  , 'sofort'
  , 'us_bank_account'
  , 'wechat_pay'
];

const EpsBanks = [
    'arzte_und_apotheker_bank'
  , 'austrian_anadi_bank_ag'
  , 'bank_austria'
  , 'bankhaus_carl_spangler'
  , 'bankhaus_schelhammer_und_schattera_ag'
  , 'bawag_psk_ag'
  , 'bks_bank_ag'
  , 'brull_kallmus_bank_ag'
  , 'btv_vier_lander_bank'
  , 'capital_bank_grawe_gruppe_ag'
  , 'dolomitenbank'
  , 'easybank_ag'
  , 'erste_bank_und_sparkassen'
  , 'hypo_alpeadriabank_international_ag'
  , 'hypo_bank_burgenland_aktiengesellschaft'
  , 'hypo_noe_lb_fur_niederosterreich_u_wien'
  , 'hypo_oberosterreich_salzburg_steiermark'
  , 'hypo_tirol_bank_ag'
  , 'hypo_vorarlberg_bank_ag'
  , 'marchfelder_bank'
  , 'oberbank_ag'
  , 'raiffeisen_bankengruppe_osterreich'
  , 'schoellerbank_ag'
  , 'sparda_bank_wien'
  , 'volksbank_gruppe'
  , 'volkskreditbank_ag'
  , 'vr_bank_braunau'
];

const FpxBanks = [
    'affin_bank'
  , 'agrobank'
  , 'alliance_bank'
  , 'ambank'
  , 'bank_islam'
  , 'bank_muamalat'
  , 'bank_rakyat'
  , 'bsn'
  , 'cimb'
  , 'deutsche_bank'
  , 'hong_leong_bank'
  , 'hsbc'
  , 'kfh'
  , 'maybank2e'
  , 'maybank2u'
  , 'ocbc'
  , 'pb_enterprise'
  , 'public_bank'
  , 'rhb'
  , 'standard_chartered'
  , 'uob'
];

const IdealBanks = [
    'abn_amro'
  , 'asn_bank'
  , 'bunq'
  , 'handelsbanken'
  , 'ing'
  , 'knab'
  , 'moneyou'
  , 'rabobank'
  , 'regiobank'
  , 'revolut'
  , 'sns_bank'
  , 'triodos_bank'
  , 'van_lanschot'
];

const P24Banks = [
    'alior_bank'
  , 'bank_millennium'
  , 'bank_nowy_bfg_sa'
  , 'bank_pekao_sa'
  , 'banki_spbdzielcze'
  , 'blik'
  , 'bnp_paribas'
  , 'boz'
  , 'citi_handlowy'
  , 'credit_agricole'
  , 'envelobank'
  , 'etransfer_pocztowy24'
  , 'getin_bank'
  , 'ideabank'
  , 'ing'
  , 'inteligo'
  , 'mbank_mtransfer'
  , 'nest_przelew'
  , 'noble_pay'
  , 'pbac_z_ipko'
  , 'plus_bank'
  , 'santander_przelew24'
  , 'tmobile_usbugi_bankowe'
  , 'toyota_bank'
  , 'volkswagen_bank'
];

export class AcssDebitDto {
  @ApiProperty({ description: 'Customer\'s bank account number.' })
  accountNumber: string;
  
  @ApiProperty({ description: 'Institution number of the customer\'s bank.' })
  institutionNumber: string;
  
  @ApiProperty({ description: 'Transit number of the customer\'s bank.' })
  transitNumber: string;
}

export class AuBecsDebitDto {

  @ApiProperty({ description: 'The account number for the bank account.' })
  accountNumber: string;

  @ApiProperty({ description: 'Bank-State-Branch number of the bank account.'})
  bsbNumber: string;
}

export class BacsDebitDto {

  @ApiPropertyOptional({ description: 'Account number of the bank account that the funds will be debited from.' })
  accountNumber?: string;
  
  @ApiPropertyOptional({ description: 'Sort code of the bank account. (e.g., `10-20-30`)' })
  sortCode?: string;
}

export class BillingDetailsDto {

  @ApiPropertyOptional()
  address?: BillingDetailsAddressDto;
  
  @ApiPropertyOptional()
  email?: string | null;
  
  @ApiPropertyOptional()
  name?: string;
  
  @ApiPropertyOptional()
  phone?: string;
}

export class BoletoDto {
  @ApiPropertyOptional({ description: 'The tax ID of the customer (CPF for individual consumers or CNPJ for businesses consumers)'})
  taxId: string;
}

export class Card1Dto {

  @ApiPropertyOptional({
    description: 'The card\'s CVC. It is highly recommended to always include this value.'
  })
  cvc?: string;

  @ApiPropertyOptional({
    description: 'Two-digit number representing the card\'s expiration month.'
  })
  expMonth: number;

  @ApiPropertyOptional({
    description: 'Four-digit number representing the card\'s expiration year.'
  })
  expYear: number;

  @ApiPropertyOptional({
    description: 'The card number, as a string without any separators.'
  })
  number: string;
}

export class Card2Dto {
  @ApiProperty()
  token: string;
}

export class EpsDto {
  @ApiPropertyOptional({ enum: EpsBanks })
  bank?: Stripe.PaymentMethodCreateParams.Eps.Bank;
}

export class FpxDto {

  @ApiPropertyOptional({
    description: 'Account holder type for FPX transaction',
    enum: ['company', 'individual']
  })
  accountHolderType?: Stripe.PaymentMethodCreateParams.Fpx.AccountHolderType;

  @ApiProperty({
    description: 'The customer\'s bank.',
    enum: FpxBanks
  })
  bank: Stripe.PaymentMethodCreateParams.Fpx.Bank;
}

export class IdealDto {
  @ApiProperty({ enum: IdealBanks })
  bank: Stripe.PaymentMethodCreateParams.Ideal.Bank
}

export class P24Dto {
  @ApiProperty({ enum: P24Banks })
  bank: Stripe.PaymentMethodCreateParams.P24.Bank
}

export class KlarnaDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(31)
  dobDay: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(12)
  dobMonth: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  dobYear: number;
}

export class UsBankAccountDto {

  @ApiPropertyOptional({
    description: 'Account holder type: individual or company.',
    enum: ['company', 'individual']
  })
  accountHolderType?: Stripe.PaymentMethodCreateParams.UsBankAccount.AccountHolderType;

  @ApiPropertyOptional({
    description: 'Account number of the bank account.'
  })
  accountNumber?: string;

  @ApiPropertyOptional({
    description: 'Account type: checkings or savings. Defaults to checking if omitted.',
    enum: ['company', 'individual']
  })
  accountType?: Stripe.PaymentMethodCreateParams.UsBankAccount.AccountType;

  @ApiPropertyOptional({
    description: 'The ID of a Financial Connections Account to use as a payment method.'
  })
  financialConnectionsAccount?: string;

  @ApiPropertyOptional({
    description: 'Routing number of the bank account.'
  })
  routingNumber?: string;
}

export class CreatePaymentMethodDto {
  @ApiPropertyOptional({
    description: 'If this is an `acss_debit` PaymentMethod, this hash contains details about the ACSS Debit payment method.'
  })
  acssDebit?: AcssDebitDto;

  @ApiPropertyOptional({
    description: 'If this is an `affirm` PaymentMethod, this hash contains details about the Affirm payment method.'
  })
  affirm?: Stripe.PaymentMethodCreateParams.Affirm;

  @ApiPropertyOptional({
    description: 'If this is an `AfterpayClearpay` PaymentMethod, this hash contains details about the AfterpayClearpay payment method.'
  })
  afterPayClearPay?: Stripe.PaymentMethodCreateParams.AfterpayClearpay;

  @ApiPropertyOptional({
    description: 'If this is an `Alipay` PaymentMethod, this hash contains details about the Alipay payment method.'
  })
  aliPay?: Stripe.PaymentMethodCreateParams.Alipay;

  @ApiPropertyOptional({
    description: 'If this is an `au_becs_debit` PaymentMethod, this hash contains details about the bank account.'
  })
  auBecsDebit?: AuBecsDebitDto;

  @ApiPropertyOptional({
    description: 'If this is a `bacs_debit` PaymentMethod, this hash contains details about the Bacs Direct Debit bank account.'
  })
  bacsDebit?: BacsDebitDto;

  @ApiPropertyOptional({
    description: 'If this is a `bancontact` PaymentMethod, this hash contains details about the Bancontact payment method.'
  })
  banContact?: Stripe.PaymentMethodCreateParams.Bancontact;

  @ApiPropertyOptional({
    description: 'Billing information associated with the PaymentMethod that may be used or required by particular types of payment methods.'
  })
  billingDetails?: BillingDetailsDto;
  
  @ApiPropertyOptional({
    description: 'If this is a `boleto` PaymentMethod, this hash contains details about the Boleto payment method.'
  })
  boleto?: BoletoDto;

  @ApiPropertyOptional({
    description: 'If this is a `card` PaymentMethod, this hash contains the user\'s card details. For backwards compatibility, you can alternatively provide a Stripe token (e.g., for Apple Pay, Amex Express Checkout, or legacy Checkout) into the card hash with format `card: {token: "tok_visa"}`. When providing a card number, you must meet the requirements for [PCI compliance](https://stripe.com/docs/security#validating-pci-compliance). We strongly recommend using Stripe.js instead of interacting with this API directly.',
    type: Card1Dto
  })
  card?: Card1Dto | Card2Dto;

  @ApiPropertyOptional()
  customer?: string;
  
  @ApiPropertyOptional({
    description: 'If this is a `customer_balance` PaymentMethod, this hash contains details about the CustomerBalance payment method.'
  })
  customerBalance?: Stripe.PaymentMethodCreateParams.CustomerBalance;

  @ApiPropertyOptional({
    description: 'If this is an `eps` PaymentMethod, this hash contains details about the EPS payment method.'
  })
  eps?: EpsDto;
  
  @ApiPropertyOptional({
    description: 'If this is an `fpx` PaymentMethod, this hash contains details about the FPX payment method.'
  })
  fpx?: FpxDto;

  @ApiPropertyOptional({
    description: 'If this is a `giropay` PaymentMethod, this hash contains details about the Giropay payment method.'
  })
  giroPay?: Stripe.PaymentMethodCreateParams.Giropay;

  @ApiPropertyOptional({
    description: 'If this is a `grabpay` PaymentMethod, this hash contains details about the GrabPay payment method.'
  })
  grabPay?: Stripe.PaymentMethodCreateParams.Grabpay;

  @ApiPropertyOptional({
    description: 'If this is an `ideal` PaymentMethod, this hash contains details about the iDEAL payment method.'
  })
  ideal?: IdealDto;

  @ApiPropertyOptional({
    description: 'If this is an `interac_present` PaymentMethod, this hash contains details about the Interac Present payment method.'
  })
  interacPresent?: Stripe.PaymentMethodCreateParams.InteracPresent;

  @ApiPropertyOptional({
    description: ' If this is a `klarna` PaymentMethod, this hash contains details about the Klarna payment method.'
  })
  klarna?: KlarnaDto;

  @ApiPropertyOptional({
    description: 'If this is a `konbini` PaymentMethod, this hash contains details about the Konbini payment method.'
  })
  konbini?: Stripe.PaymentMethodCreateParams.Konbini;

  @ApiPropertyOptional({
    description: 'If this is an `Link` PaymentMethod, this hash contains details about the Link payment method.'
  })
  link?: Stripe.PaymentMethodCreateParams.Link;

  @ApiPropertyOptional()
  metadata?: {[name: string]: string | number | null};

  @ApiPropertyOptional({
    description: ' If this is an `oxxo` PaymentMethod, this hash contains details about the OXXO payment method.'
  })
  oxxo?: Stripe.PaymentMethodCreateParams.Oxxo;

  @ApiPropertyOptional({
    description: 'If this is a `p24` PaymentMethod, this hash contains details about the P24 payment method.'
  })
  p24?: P24Dto;

  @ApiPropertyOptional({
    description: 'If this is a `paynow` PaymentMethod, this hash contains details about the PayNow payment method.'
  })
  payNow?: Stripe.PaymentMethodCreateParams.Paynow;

  @ApiPropertyOptional({
    description: 'If this is a `promptpay` PaymentMethod, this hash contains details about the PromptPay payment method.'
  })
  promptpay?: Stripe.PaymentMethodCreateParams.Promptpay;

  @ApiPropertyOptional({
    description: 'Options to configure Radar. See [Radar Session](https://stripe.com/docs/radar/radar-session) for more information.'
  })
  radar_session?: string;

  @ApiPropertyOptional({
    description: 'If this is a `sepa_debit` PaymentMethod, this hash contains details about the SEPA debit bank account.'
  })
  sepaDebitIban?: string;

  @ApiPropertyOptional({
    description: 'If this is a `sofort` PaymentMethod, this hash contains details about the SOFORT payment method.',
    enum: ['AT', 'BE', 'DE', 'ES', 'IT', 'NL']
  })
  sofortCountry?: 'AT' | 'BE' | 'DE' | 'ES' | 'IT' | 'NL';

  @ApiPropertyOptional({
    description: 'The type of the PaymentMethod. An additional hash is included on the PaymentMethod with a name matching this value. It contains additional information specific to the PaymentMethod type.',
    enum: PaymentMethodTypes,
    default: 'card'
  })
  type?: Stripe.PaymentMethodCreateParams.Type;

  @ApiPropertyOptional({
    description: 'If this is an `us_bank_account` PaymentMethod, this hash contains details about the US bank account payment method.'
  })
  usBankAccount?: UsBankAccountDto;

  @ApiPropertyOptional({
    description: 'If this is an `wechat_pay` PaymentMethod, this hash contains details about the wechat_pay payment method.'
  })
  wechatPay?: Stripe.PaymentMethodCreateParams.WechatPay;
}
