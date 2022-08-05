import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Stripe from 'stripe';
import { BaseDto } from '../base.dto';
import { AddressDto, DobDto } from '../shared.dto';

const PaymentMethodTypes = [
    'acss_debit'
  , 'affirm'
  , 'afterpay_clearpay'
  , 'alipay'
  , 'au_becs_debit'
  , 'bacs_debit'
  , 'bancontact'
  , 'boleto'
  , 'card'
  , 'card_present'
  , 'customer_balance'
  , 'eps'
  , 'fpx'
  , 'giropay'
  , 'grabpay'
  , 'ideal'
  , 'interac_present'
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

const PmEpsBanks = [
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

const PmFpxBanks = [
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

const PmIdealBanks = [
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

const PmIdealBics = [
    'ABNANL2A'
  , 'ASNBNL21'
  , 'BUNQNL2A'
  , 'FVLBNL22'
  , 'HANDNL2A'
  , 'INGBNL2A'
  , 'KNABNL2H'
  , 'MOYONL21'
  , 'RABONL2U'
  , 'RBRBNL21'
  , 'REVOLT21'
  , 'SNSBNL2A'
  , 'TRIONL2U'
];

const PmP24Banks = [
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

export class PmAcssDebitDto {
  @ApiProperty()
  bankName: string | null;
  
  @ApiProperty()
  fingerprint: string | null;
  
  @ApiProperty()
  institutionNumber: string | null;
  
  @ApiProperty()
  last4: string | null;
  
  @ApiProperty()
  transitNumber: string | null;
}

export class PmAuBecsDebitDto {
  @ApiProperty()
  bsbNumber: string | null;

  @ApiProperty()
  fingerprint: string | null;

  @ApiProperty()
  last4: string | null;
}

export class PmBacsDebitDto {
  @ApiProperty()
  fingerprint: string | null;

  @ApiProperty()
  last4: string | null;

  @ApiProperty()
  sortCode: string | null;
}

export class PmBillingDetailsDto {
  @ApiProperty()
  address: AddressDto | null;

  @ApiProperty()
  email: string | null;

  @ApiProperty()
  name: string | null;

  @ApiProperty()
  phone: string | null;
}

export class PmBoleToDto {
  @ApiProperty()
  taxId: string;
}

export class PmCardChecksDto {

  @ApiProperty({
    description: 'If a address line1 was provided, results of the check, one of `pass`, `fail`, `unavailable`, or `unchecked`.'
  })
  addressLine1Check: string | null;

  @ApiProperty({
    description: 'If a address postal code was provided, results of the check, one of `pass`, `fail`, `unavailable`, or `unchecked`.'
  })
  addressPostalCodeCheck: string | null;

  @ApiProperty({
    description: 'If a CVC was provided, results of the check, one of `pass`, `fail`, `unavailable`, or `unchecked`.'
  })
  cvcCheck: string | null;
}

export class PmCardNetworksDto {
  @ApiProperty({ isArray: true, type: String })
  available: Array<string>;

  @ApiProperty()
  preferred: string | null;
}

export class PmCardWalletMasterPassDto {
  @ApiProperty()
  billingAddress: AddressDto | null;
  
  @ApiProperty()
  email: string | null;
  
  @ApiProperty()
  name: string | null;
  
  @ApiProperty()
  shippingAddress: AddressDto | null;
}

export class PmCardWalletVisaCheckoutDto {

  @ApiProperty()
  billingAddress: AddressDto | null;

  @ApiProperty()
  email: string | null;

  @ApiProperty()
  name: string | null;

  @ApiProperty()
  shippingAddress: AddressDto | null;
}

export class PmCardWalletDto {

  @ApiPropertyOptional()
  amexExpressCheckout?: Stripe.PaymentMethod.Card.Wallet.AmexExpressCheckout;

  @ApiPropertyOptional()
  applePay?: Stripe.PaymentMethod.Card.Wallet.ApplePay;

  @ApiPropertyOptional()
  dynamicLast4: string | null;

  @ApiPropertyOptional()
  googlePay?: Stripe.PaymentMethod.Card.Wallet.GooglePay;

  @ApiPropertyOptional()
  masterPass?: PmCardWalletMasterPassDto;

  samsungPay?: Stripe.PaymentMethod.Card.Wallet.SamsungPay;

  @ApiProperty({
    enum: ['amex_express_checkout', 'apple_pay', 'google_pay', 'masterpass', 'samsung_pay', 'visa_checkout']
  })
  type: Stripe.PaymentMethod.Card.Wallet.Type;

  @ApiProperty()
  visaCheckout?: PmCardWalletVisaCheckoutDto;
}

export class PmCardDto {
  @ApiProperty({
    description: 'Card brand. Can be `amex`, `diners`, `discover`, `jcb`, `mastercard`, `unionpay`, `visa`, or `unknown`.'
  })
  brand: string;

  @ApiProperty()
  checks: PmCardChecksDto | null;
  
  @ApiProperty()
  country: string | null;
  
  @ApiProperty()
  description?: string | null;
  
  @ApiProperty()
  expMonth: number;
  
  @ApiProperty()
  expYear: number;
  
  @ApiProperty()
  fingerprint?: string | null;
  
  @ApiProperty({
    description: 'Card funding type. Can be `credit`, `debit`, `prepaid`, or `unknown`.'
  })
  funding: string;

  @ApiPropertyOptional({
    description: ' Issuer identification number of the card. (For internal use only and not typically available in standard API requests.)'
  })
  iin?: string | null;

  @ApiPropertyOptional()
  issuer?: string | null;

  @ApiProperty()
  last4: string;

  @ApiProperty()
  networks: PmCardNetworksDto | null;

  @ApiProperty()
  threeDSecureUsageSupported: boolean | null;

  @ApiProperty()
  wallet: PmCardWalletDto | null;
}

export class PmFpxDto {
  @ApiProperty({ enum: ['company', 'individual'] })
  accountHolderType: Stripe.PaymentMethod.Fpx.AccountHolderType | null;

  @ApiProperty({ enum: PmFpxBanks })
  bank: Stripe.PaymentMethod.Fpx.Bank;
}

export class PmIdealDto {
  @ApiProperty({ enum: PmIdealBanks })
  bank: Stripe.PaymentMethod.Ideal.Bank | null;
  
  @ApiProperty({ enum: PmIdealBics })
  bic: Stripe.PaymentMethod.Ideal.Bic | null;
}

export class PmLinkDto {
  @ApiProperty()
  email: string | null;

  @ApiProperty()
  persistentToken?: string;
}

export class PmGeneratedFromDto {
  @ApiProperty()
  charge: string | null;

  @ApiProperty()
  setupAttempt: string | null;
}

export class PmSepaDebitDto {
  @ApiProperty()
  bankCode: string | null;

  @ApiProperty()
  branchCode: string | null;

  @ApiProperty()
  country: string | null;

  @ApiProperty()
  fingerprint: string | null;

  @ApiProperty()
  generatedFrom: PmGeneratedFromDto | null;

  @ApiProperty()
  last4: string | null;
}

export class PmUsBankAccountNetworksDto {
  @ApiProperty()
  preferred: string | null;

  @ApiProperty({ enum: ['ach', 'us_domestic_wire'] })
  supported: Array<Stripe.PaymentMethod.UsBankAccount.Networks.Supported>;
}

export class PmUsBankAccountDto {
  @ApiProperty({ enum: ['company', 'individual'] })
  accountHolderType: Stripe.PaymentMethod.UsBankAccount.AccountHolderType | null;

  @ApiProperty({ enum: ['checking', 'savings'] })
  accountType: Stripe.PaymentMethod.UsBankAccount.AccountType | null;

  @ApiProperty()
  bankName: string | null;

  @ApiProperty()
  financialConnectionsAccount?: string | null;
  
  @ApiProperty()
  fingerprint: string | null;
  
  @ApiProperty()
  last4: string | null;
  
  @ApiProperty()
  networks: PmUsBankAccountNetworksDto | null;
  
  @ApiProperty()
  routingNumber: string | null;
}

export class PaymentMethodDto extends BaseDto {

  @ApiPropertyOptional()
  acssDebit?: PmAcssDebitDto;

  @ApiPropertyOptional()
  affirm?: Stripe.PaymentMethod.Affirm;
  
  @ApiPropertyOptional()
  afterPayClearPay?: Stripe.PaymentMethod.AfterpayClearpay;
  
  @ApiPropertyOptional()
  aliPay?: Stripe.PaymentMethod.Alipay;
  
  @ApiPropertyOptional()
  auBecsDebit?: PmAuBecsDebitDto;
  
  @ApiPropertyOptional()
  bacsDebit?: PmBacsDebitDto;
  
  @ApiPropertyOptional()
  banContact?: Stripe.PaymentMethod.Bancontact;
  
  @ApiPropertyOptional()
  billingDetails: PmBillingDetailsDto;
  
  @ApiPropertyOptional()
  boleTo?: PmBoleToDto;

  @ApiPropertyOptional()
  card?: PmCardDto;

  @ApiProperty()
  cardPresent?: Stripe.PaymentMethod.CardPresent;

  @ApiProperty()
  customer: string | null;

  @ApiPropertyOptional()
  customerBalance?: Stripe.PaymentMethod.CustomerBalance;
  
  @ApiPropertyOptional({ enum: PmEpsBanks })
  epsBank?: Stripe.PaymentMethod.Eps.Bank;
  
  @ApiPropertyOptional()
  fpx?: PmFpxDto;
  
  @ApiPropertyOptional()
  giroPay?: Stripe.PaymentMethod.Giropay;
  
  @ApiPropertyOptional()
  grabPay?: Stripe.PaymentMethod.Grabpay;
  
  @ApiPropertyOptional()
  ideal?: Stripe.PaymentMethod.Ideal;
  
  @ApiPropertyOptional()
  interacPresent?: Stripe.PaymentMethod.InteracPresent;
  
  @ApiPropertyOptional()
  klarnaDob?: DobDto;
  
  @ApiPropertyOptional()
  konbini?: Stripe.PaymentMethod.Konbini;
  
  @ApiPropertyOptional()
  link?: PmLinkDto;
  
  @ApiPropertyOptional()
  oxxo?: Stripe.PaymentMethod.Oxxo;
  
  @ApiPropertyOptional({
    enum: PmP24Banks
  })
  p24Bank?: Stripe.PaymentMethod.P24.Bank;
  
  @ApiPropertyOptional()
  payNow?: Stripe.PaymentMethod.Paynow;
  
  @ApiPropertyOptional()
  promptPay?: Stripe.PaymentMethod.Promptpay;
  
  @ApiPropertyOptional()
  radarSession?: string;
  
  @ApiPropertyOptional()
  sepaDebit?: PmSepaDebitDto;
  
  @ApiPropertyOptional()
  sofortCountry?: string;
  
  @ApiProperty({ enum: PaymentMethodTypes })
  type: Stripe.PaymentMethod.Type;
  
  @ApiPropertyOptional()
  usBankAccount?: PmUsBankAccountDto;
  
  @ApiPropertyOptional()
  wechatPay?: Stripe.PaymentMethod.WechatPay;
}
