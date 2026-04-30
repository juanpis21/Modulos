import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrometheusService } from './monitoring/prometheus.service';
import { MetricsInterceptor } from './monitoring/metrics.interceptor';

import { json, urlencoded, static as expressStatic } from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  // Servir archivos estáticos de uploads
  const uploadsDirs = [
    join(__dirname, '..', 'uploads', 'publicaciones'),
    join(__dirname, '..', 'uploads', 'profiles'),
    join(__dirname, '..', 'uploads', 'pets')
  ];
  uploadsDirs.forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });
  app.use('/uploads', expressStatic(join(__dirname, '..', 'uploads')));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const prometheusService = app.get(PrometheusService);
  app.useGlobalInterceptors(new MetricsInterceptor(prometheusService));

  const config = new DocumentBuilder()
    .setTitle('HelpyourPet API')
    .setDescription('API para gestión de clínica veterinaria')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
  console.log(`PgAdmin available at: http://localhost:5050`);
  console.log(`PostgreSQL running on: localhost:5432`);
}
bootstrap();
