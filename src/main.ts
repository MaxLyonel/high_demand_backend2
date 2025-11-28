// framework
import { NestFactory } from '@nestjs/core';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
// external dependencies
import { DocumentBuilder } from '@nestjs/swagger';
// own implementation
import { AppModule } from './app.module';
import { TypenameInterceptor } from '@access-control/infrastructure/adapters/primary/interceptors/typename.interceptor';
import { RequestContextInterceptor } from '@infrastructure-general/register-logs/request-content.interceptor';
import { RequestContextService } from '@infrastructure-general/register-logs/request-context.service';
import { json, urlencoded } from 'express';

require('module-alias/register');

async function bootstrap() {
  const logger = new Logger(' ========== BACKEND ALTA DEMANDA ========= ')
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ limit: '100mb', extended: true }));

  // Configuración para validación con dtos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades que no estén en el dto
      forbidNonWhitelisted: false, // lanza error si hay propiedades extra
      transform: true, // conversión de tipos
      transformOptions: { enableImplicitConversion: true },
    })
  );

  app.useGlobalInterceptors(new TypenameInterceptor());
  app.useGlobalInterceptors(new RequestContextInterceptor(app.get(RequestContextService)));


  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '',
        method: RequestMethod.GET
      }
    ]
  })

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ALTA DEMANDA DOCUMENTATION APIS')
    .setDescription('Documentación para las APIS de Alta Demanda')
    .setVersion('1.0')


  await app.listen(process.env.PORT ?? 3000);
  logger.log(`💪 App Corriendo en el puerto ${process.env.PORT}`)
}
bootstrap();
