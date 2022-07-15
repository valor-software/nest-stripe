import { BadRequestException, Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import Stripe from 'stripe';
import { StripeService } from '../stripe.service';
import { WebhookResponse } from './webhook.interfaces';
import { WebhookService } from './webhook.service';

@ApiTags('stripe/webhooks')
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

//#region subscription-schedule
  @ApiResponse({ type: WebhookResponse })
  @Post('/subscription-schedule-aborted')
  async subscriptionScheduleAborted(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifySubscriptionScheduleAborted(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @ApiResponse({ type: WebhookResponse })
  @Post('/subscription-schedule-canceled')
  async subscriptionScheduleCanceled(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifySubscriptionScheduleCanceled(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @ApiResponse({ type: WebhookResponse })
  @Post('/subscription-schedule-completed')
  async subscriptionScheduleCompleted(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifySubscriptionScheduleCompleted(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @ApiResponse({ type: WebhookResponse })
  @Post('/subscription-schedule-created')
  async subscriptionScheduleCreated(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifySubscriptionScheduleCreated(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @ApiResponse({ type: WebhookResponse })
  @Post('/subscription-schedule-updated')
  async subscriptionScheduleUpdated(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifySubscriptionScheduleUpdated(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @ApiResponse({ type: WebhookResponse })
  @Post('/subscription-schedule-released')
  async subscriptionScheduleReleased(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifySubscriptionScheduleReleased(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @ApiResponse({ type: WebhookResponse })
  @Post('/subscription-schedule-expired')
  async subscriptionScheduleExpired(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.getEvent(req);
      this.webhookService.notifySubscriptionScheduleExpired(evt);
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
