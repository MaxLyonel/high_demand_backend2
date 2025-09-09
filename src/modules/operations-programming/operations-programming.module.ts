import { Module } from "@nestjs/common";
import { OperativeController } from "./infrastructure/adapters/primary/controllers/operative.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OperativeEntity } from "./infrastructure/adapters/secondary/persistence/entities/operations-programming.entity";
import { OperationsProgrammingService } from "./domain/ports/inbound/operations-programming.service";
import { OperationsProgrammingServiceImpl } from "./application/service/operations-programming.impl";
import { OperationsProgrammingRepository } from "./domain/ports/outbound/operations-programming.repository";
import { OperativeProgrammingRepositoryImpl } from './infrastructure/adapters/secondary/persistence/repositories/operative-programming.service.impl';
import { DatabaseModule } from "@infrastructure-general/database/database.module";


@Module({
  providers: [
    {
      provide: OperationsProgrammingService,
      useClass: OperationsProgrammingServiceImpl
    },
    {
      provide: OperationsProgrammingRepository,
      useClass: OperativeProgrammingRepositoryImpl
    }
  ],
  controllers: [OperativeController],
  imports: [
    TypeOrmModule.forFeature([
      OperativeEntity
    ], 'alta_demanda')
  ],
  exports: [OperationsProgrammingRepository]
})
export class OperationsProgrammingModule {}