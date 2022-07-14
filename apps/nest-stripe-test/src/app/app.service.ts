import { WebhookService } from '@nest/stripe';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly stripeWebhookService: WebhookService) {
    this.stripeWebhookService.paymentIntentCreated$.subscribe(console.log)
  }

  getData(): { message: string } {
    return { message: 'Welcome to nest-stripe-test!' };
  }
}
