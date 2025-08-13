// framework
import { NestFactory } from '@nestjs/core';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
// external dependencies
import { DocumentBuilder } from '@nestjs/swagger';
// own implementation
import { AppModule } from './app.module';

require('module-alias/register');

async function bootstrap() {
  const logger = new Logger(' ========== BACKEND ALTA DEMANDA ========= ')
  const app = await NestFactory.create(AppModule, { cors: true });

  // Configuración para validación con dtos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades que no estén en el dto
      forbidNonWhitelisted: false, // lanza error si hay propiedades extra
      transform: true, // conversión de tipos
    })
  );


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
