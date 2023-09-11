import { CanActivate, DynamicModule, Module, ModuleMetadata, Provider, Type, } from '@nestjs/common';
import { STRIPE_AUTH_GUARD } from './stripe-auth.guard';
import { StripeConfig, STRIPE_CONFIG } from './stripe.config';
import { StripeController } from './stripe.controller';
import { StripeLogger } from './stripe.logger';
import { StripeService } from './stripe.service';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookService } from './webhook/webhook.service';
import {
  CheckoutSessionController,
  CustomerController,
  PaymentIntentController,
  PaymentMethodController,
  PriceController,
  ProductController,
  SubscriptionController,
  InvoiceController,
  UsageRecordController,
  QuotesController,
  SubscriptionScheduleController,
} from './controllers';
import { TestClocksController } from './controllers/test-clock.controller';

const controllerList = [
  PaymentIntentController,
  CheckoutSessionController,
  CustomerController,
  PaymentMethodController,
  PriceController,
  ProductController,
  SubscriptionController,
  SubscriptionScheduleController,
  InvoiceController,
  UsageRecordController,
  QuotesController,
  TestClocksController,

  StripeController,
  WebhookController
];
const providerList = [StripeService, StripeLogger, WebhookService];
const exportList = [StripeService, WebhookService];

export interface StripeConfigFactory {
  createStripeConfig():
    | Promise<StripeConfig>
    | StripeConfig;
}

export interface StripeConfigAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
  useExisting?: Type<StripeConfigFactory>;
  useClass?: Type<StripeConfigFactory>;
  useFactory?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => Promise<StripeConfig> | StripeConfig;
}

@Module({
  controllers: controllerList,
  providers: providerList,
  exports: exportList,
})
export class StripeModule {
  static forRoot(config: StripeConfig, authGuard: Type<CanActivate>): DynamicModule {
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

  static forRootAsync(options: StripeConfigAsyncOptions, authGuard: Type<CanActivate>): DynamicModule {
    const allImports = options.imports;
    return {
      module: StripeModule,
      imports: allImports,
      controllers: controllerList,
      providers: [
        this.createStripeConfigAsyncProviders(options),
        {
          provide: STRIPE_AUTH_GUARD,
          useClass: authGuard
        },
        ...providerList,
      ],
      exports: exportList
    }
  }

  private static createStripeConfigAsyncProviders(
    options: StripeConfigAsyncOptions,
  ): Provider {
    if (options) {
      if (options.useFactory) {
        return {
          provide: STRIPE_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject || [],
        };
      } else {
        // For useClass and useExisting...
        return {
          provide: STRIPE_CONFIG,
          useFactory: async (configFactory: StripeConfigFactory) =>
            await configFactory.createStripeConfig(),
          inject: [options.useExisting || options.useClass],
        };
      }
    } else {
      return {
        provide: STRIPE_CONFIG,
        useValue: {},
      };
    }
  }
}
