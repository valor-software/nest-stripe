import { StripeModule } from '@nest/stripe';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { AppService } from './app.service';
import { AppAuthGuard } from './auth.guard';

@Module({
  imports: [StripeModule.forRootAsync({
    useFactory: () => ({
      apiKey: process.env.STRIPE_API_KEY,
      webHookSignature: process.env.STRIPE_WEBHOOK_SIGNATURE,
      successUrl: 'http://localhost:3333/purchase-success',
      cancelUrl: 'http://localhost:3333/card',
      currency: 'usd'
    })},AppAuthGuard)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
