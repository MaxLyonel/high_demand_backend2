// src/common/request-context/request-context.module.ts
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { RequestContextService } from './request-context.service';

@Module({
  providers: [RequestContextService],
  exports: [RequestContextService], // permite inyectarlo en cualquier servicio o subscriber
})
export class RequestContextModule {}
