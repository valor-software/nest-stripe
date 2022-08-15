import { StripeService, WebhookEventType, WebhookService } from '@nest/stripe';
import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class AppService {
  constructor(
    private readonly stripeWebhookService: WebhookService,
    private readonly stripeService: StripeService
  ) {
    this.stripeWebhookService.subscribeToEvent(WebhookEventType.invoicePaid).subscribe(console.log);
    this.stripeWebhookService.subscribeToEvent(WebhookEventType.customerSubscriptionCreated).subscribe((e) => this.createMeteredUsage(e));
    this.stripeWebhookService.subscribeToEvent(WebhookEventType.customerSubscriptionUpdated).subscribe((e) => this.createMeteredUsage(e));
  }

  getConfig(): any {
    return {
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY
    };
  }

  async createMeteredUsage(evt: Stripe.Event) {
    const stripeSubscription = evt.data.object as Stripe.Subscription;
    const subscriptionRes = await this.stripeService.getSubscriptionById(stripeSubscription.id);
    if (subscriptionRes.success) {
      const subscription = subscriptionRes.data;
      subscription.items.forEach(async si => {
        if (si.plan.usageType === 'metered') {
          const r = await this.stripeService.createUsageRecord(si.id, {
            quantity: si.quantity || 1,
            action: 'increment',
            timestamp: 'now',
          });
          if (!r.success) {
            Logger.error(r.errorMessage, 'Create Usage Record');
          } else {
            Logger.debug(r.usageRecord.id, 'Usage Record')
          }
        }
      })
    } else {
      throw new Error(subscriptionRes.errorMessage);
    }
  }

}
