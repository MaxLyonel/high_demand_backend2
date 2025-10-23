// src/activity-log/activity-log.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from './activity-log.entity';
import { ActivityLogService } from './activity-log.service';
import { GenericSubscriber } from './activity-log.subscriber';
import { RequestContextModule } from './request-context.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityLog], 'alta_demanda'), // registra la entidad
    RequestContextModule,                    // para inyectar RequestContextService en el subscriber
  ],
  providers: [
    ActivityLogService,
    GenericSubscriber, // el subscriber genérico se registra automáticamente
  ],
  exports: [
    ActivityLogService, // para poder usarlo en otros módulos si es necesario
  ],
})
export class ActivityLogModule {}
