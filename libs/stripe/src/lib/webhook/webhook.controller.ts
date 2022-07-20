import { BadRequestException, Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import Stripe from 'stripe';
import { StripeService } from '../stripe.service';
import { WebhookResponse } from './webhook.interfaces';
import { WebhookService } from './webhook.service';

@ApiTags('Stripe Webhooks')
@Controller('stripe/webhooks')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly stripeService: StripeService
  ) {}

  @ApiResponse({ type: WebhookResponse })
  @Post('/all')
  async all(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifyPaymentIntentCreated(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  //#region payment-intent
  @ApiResponse({ type: WebhookResponse })
  @Post('/payment-intent-created')
  async paymentIntentCreated(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifyPaymentIntentCreated(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @ApiResponse({ type: WebhookResponse })
  @Post('/payment-intent-succeeded')
  async paymentIntentSucceeded(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifyPaymentIntentSucceeded(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @ApiResponse({ type: WebhookResponse })
  @Post('/payment-intent-succeeded')
  async paymentIntentCanceled(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifyPaymentIntentCanceled(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  //#endregion

  //#region charge
  @ApiResponse({ type: WebhookResponse })
  @Post('/charge-refunded')
  async chargeRefunded(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifyChargeRefunded(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @ApiResponse({ type: WebhookResponse })
  @Post('/charge-succeeded')
  async chargeSucceeded(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifyChargeSucceeded(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @ApiResponse({ type: WebhookResponse })
  @Post('/charge-failed')
  async chargeFailed(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifyChargeFailed(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  //#endregion

  //#region Invoice
  @ApiResponse({ type: WebhookResponse })
  @Post('/invoice-payment-succeeded')
  async invoicePaymentSucceeded(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      const dataObject = evt.data.object;
      if (dataObject['billing_reason'] === 'subscription_create') {
        const subscriptionId = dataObject['subscription']
        const paymentIntentId = dataObject['payment_intent']
        await this.stripeService.updateDefaultSubscriptionPaymentMethodFromPaymentIntent(subscriptionId, paymentIntentId)
      }
      this.webhookService.notifyInvoicePaymentSucceeded(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  @ApiResponse({ type: WebhookResponse })
  @Post('/invoice-payment-failed')
  async invoicePaymentFailed(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifyInvoicePaymentFailed(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  @ApiResponse({ type: WebhookResponse })
  @Post('/invoice-payment-finalized')
  async invoicePaymentFinalized(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifyInvoicePaymentFinalized(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  //#endregion

  //#region Customer Subscription
  @ApiResponse({ type: WebhookResponse })
  @Post('/customer-subscription-deleted')
  async customerSubscriptionDeleted(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifyCustomerSubscriptionDeleted(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  @ApiResponse({ type: WebhookResponse })
  @Post('/customer-subscription-trial-will-end')
  async customerSubscriptionTrialWillEnd(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifyCustomerSubscriptionTrialWillEnd(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
  //#endregion
  
  private getEvent(req: RawBodyRequest<Request>): Promise<Stripe.Event> {
    const payload = req.rawBody.toString('utf-8');
      const headerSignature = req.header('stripe-signature');
      return this.stripeService.buildWebhookEvent(payload, headerSignature);
  }
}
