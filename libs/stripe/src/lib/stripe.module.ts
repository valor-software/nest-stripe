import { CanActivate, DynamicModule, Module, Type, } from '@nestjs/common';
import { STRIPE_AUTH_GUARD } from './stripe-auth.guard';
import { StripeConfig, STRIPE_CONFIG } from './stripe.config';
import { StripeController } from './stripe.controller';
import { StripeLogger } from './stripe.logger';
import { StripeService } from './stripe.service';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookService } from './webhook/webhook.service';

const controllerList = [StripeController, WebhookController];
const providerList = [StripeService, StripeLogger, WebhookService];
const exportList = [StripeService, WebhookService];

@Module({
  controllers: controllerList,
  providers: providerList,
  exports: exportList,
})
export class StripeModule {
  static configure(config: StripeConfig, authGuard: Type<CanActivate>): DynamicModule {
    return {
      module: StripeModule,
      controllers: controllerList,
      providers: [
        {
          provide: STRIPE_CONFIG,
          useValue: config,
        },
        {
          provide: STRIPE_AUTH_GUARD,
          useClass: authGuard
        },
        ...providerList,
      ],
      exports: exportList,
    };
  }
}
