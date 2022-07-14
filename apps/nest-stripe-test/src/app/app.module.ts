import { StripeModule } from '@nest/stripe';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppAuthGuard } from './auth.guard';

@Module({
  imports: [StripeModule.configure({
    apiKey: 'sk_test_51LLQ2WDqFfDeJ7rtjkGENsraHJBkXr7fenkNSZhQySP5NsA9KYhLxuiOmc2Xb7TYQiyzTSYxRTjb6hZVhtxfbNkR00uXlreyol',
    webHookSignature: 'whsec_jaQ7RGYC5PdclQ5QuXBYg9zKrDuOYNT7',
    successUrl: 'http://localhost:3333/purchase-success',
    cancelUrl: 'http://localhost:3333/card'
  }, AppAuthGuard)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
