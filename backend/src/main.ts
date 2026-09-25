import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir uploads estáticos (certificados PDF) en /uploads
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  const config = app.get(ConfigService);

  // CORS
  app.enableCors({ origin: config.get('CORS_ORIGINS') ?? '*' });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prefijo global de la API
  app.setGlobalPrefix(config.get('API_PREFIX') ?? 'api');

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SIPPCI API')
    .setDescription('Sistema de Prevención y Protección Contra Incendios')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(
    config.get('SWAGGER_PATH') ?? 'api/docs',
    app,
    document,
  );

  await app.listen(config.get('PORT') ?? 3001);
}

bootstrap();