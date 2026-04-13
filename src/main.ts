import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrometheusService } from './monitoring/prometheus.service';
import { MetricsInterceptor } from './monitoring/metrics.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Desactivado temporalmente para debugging
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global metrics interceptor
  const prometheusService = app.get(PrometheusService);
  app.useGlobalInterceptors(new MetricsInterceptor(prometheusService));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Clinic Pet API')
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
