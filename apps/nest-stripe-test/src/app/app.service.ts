import { WebhookEventType, WebhookService } from '@nest/stripe';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly stripeWebhookService: WebhookService) {
    this.stripeWebhookService.subscribeToEvent(WebhookEventType.invoicePaid).subscribe(console.log)
  }

  getConfig(): any {
    return {
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY
    };
  }
}
