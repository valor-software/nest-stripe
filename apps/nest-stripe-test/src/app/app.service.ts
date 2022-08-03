import { WebhookService } from '@nest/stripe';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly stripeWebhookService: WebhookService) {
    this.stripeWebhookService.paymentIntentCreated$.subscribe(console.log)
  }

  getConfig(): any {
    return {
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY
    };
  }
}
