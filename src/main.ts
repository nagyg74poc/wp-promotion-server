import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';
import { logger } from './helpers/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('wpPromotion')
    .setDescription('The wpPromotion API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  // app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));
  // // app.use(express.static(path.join(__dirname, 'public')));
  // app.useStaticAssets(path.join(__dirname, '..', 'public'));
  await app.init();
  await app.listen(3000, () => {
    logger.info(`Server listening on http://localhost:3000`, null);
  });
}

bootstrap();
