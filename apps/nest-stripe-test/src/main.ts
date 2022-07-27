/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { AppModule } from './app/app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useStaticAssets(join(__dirname, 'assets', 'public'));
  app.setBaseViewsDir(join(__dirname, 'assets', 'views'));
  app.setViewEngine('hbs');

  const swaggerConfig = new DocumentBuilder()
      .setTitle('Nest Stripe')
      .setDescription('Nest Stripe API test')
      .setVersion('1.0')
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
