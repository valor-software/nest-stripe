import { BadRequestException, Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
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
  @Post('/payment-intent-created')
  async paymentIntentCreated(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const payload = req.rawBody.toString('utf-8');
      const headerSignature = req.header('stripe-signature');
      const evt = await this.stripeService.buildWebhookEvent(payload, headerSignature);
      this.webhookService.notifyPaymentIntentCreated(evt);
      return { success: true }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
