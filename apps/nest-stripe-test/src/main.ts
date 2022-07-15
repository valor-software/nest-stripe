/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app/app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const swaggerConfig = new DocumentBuilder()
      .setTitle('Nest Stripe')
      .setDescription('Nest Stripe API test')
      .setVersion('1.0')
      .addTag('nest-stripe')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
