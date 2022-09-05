<p align="center">
  <h3 align="center">
    @opavlovskyi/nestjs-stripe
  </h3>

  <p align="center">
    Stripe service with DTO's and swagger for nestjs projects.
    Include Webhooks listeners and Event enums.
  </p>
</p>

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [About](#about)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About

`nestjs-stripe` implements a module, `StripeModule`, which when imported into
your nestjs project provides a Stripe client to any class that injects it. This
lets Stripe be worked into your dependency injection workflow without having to
do any extra work outside of the initial setup.

## Installation

```bash
npm install --save @opavlovskyi/nestjs-stripe
```

## Getting Started

To use `@opavlovskyi/nestjs-stripe` import `StripeModule`

```typescript
import { Module } from '@nestjs-common';
import { StripeModule } from '@opavlovskyi/nestjs-stripe';

@Module({
  imports: [
    StripeModule.forRoot({
      apiKey: process.env.STRIPE_API_KEY,
      webHookSignature: process.env.STRIPE_WEBHOOK_SIGNATURE,
      successUrl: 'http://localhost:3333/purchase-success',
      cancelUrl: 'http://localhost:3333/card',
      currency: 'usd'
    }, AppAuthGuard)
  ],
})
export class AppModule {}
```

You can then inject the Stripe client into any of your injectables by using a
custom decorator

```typescript
import { CreateCheckoutSessionDto, StripeService, WebhookEventType, WebhookService } from '@nest/stripe';
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

  async creteCheckoutSession(dto: CreateCheckoutSessionDto) {
    const response = await this.stripeService.createCheckoutSession(dto);
    if (response.success) {
      return response.sessionId
    } else {
      throw new Error(response.errorMessage);
    }
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
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

- [nestjs](https://nestjs.com)
- [stripe-node](https://github.com/stripe/stripe-node)

Copyright &copy; 2022 Oleksandr Pavlovskyi