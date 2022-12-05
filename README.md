

# Nestjs Stripe

This libs has wrap service for Stripe [API](https://stripe.com/docs/api) and web endpoints (with Swagger) to call Stripe API
Uses in nestjs projects.

Include Webhooks listeners and Stripe Event enums.
## Adding to your project

- `npm install --save @valor/nestjs-stripe`
- `yarn add @valor/nestjs-stripe`

## Use in application

There are two ways use `StripeModule` in application

- ### Using `StripeModule#forRootAsync` method in imports

```typescript
StripeModule.forRootAsync({
  useFactory: (config: AppConfigService) => ({
    apiKey: config.values.stripe.apiKey,
    webHookSignature: config.values.stripe.webHookSignature,
    successUrl: 'http://localhost:3333/purchase-success',
    cancelUrl: 'http://localhost:3333/card',
    currency: 'usd'
  }),
  inject: [AppConfigService]
}, AppAuthGuard)
```
- ### Using `StripeModule#forRoot` method in imports

```typescript
StripeModule.forRoot({
  apiKey: process.env.STRIPE_API_KEY,
  webHookSignature: process.env.STRIPE_WEBHOOK_SIGNATURE,
  successUrl: 'http://localhost:3333/purchase-success',
  cancelUrl: 'http://localhost:3333/card',
  currency: 'usd'
}, AppAuthGuard)
```