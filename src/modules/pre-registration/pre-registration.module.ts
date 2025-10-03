import { Module } from "@nestjs/common";
import { CatalogsController } from "./infrastructure/adapters/primary/controllers/catalogs.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogsService } from "./domain/ports/inbound/catalogs.service";
import { CatalogsServiceImpl } from "./application/service/catalogs.impl";
import { CatalogsRepository } from "./domain/ports/outbound/catalogs.repository";
import { CatalogsRepositoryImpl } from "./infrastructure/adapters/secondary/persistence/repositories/catalogs.repository.impl";
import { RelationshipEntity } from "./infrastructure/adapters/secondary/persistence/entities/relationship.entity";
import { CriteriaEntity } from "./infrastructure/adapters/secondary/persistence/entities/criteria.entity";
import { PlaceTypeEntity } from "./infrastructure/adapters/secondary/persistence/entities/place-type.entity";
import { StudentRepository } from "./domain/ports/outbound/student.repository";
import { StudentRepositoryImpl } from "./infrastructure/adapters/secondary/persistence/repositories/student.repository.impl";
import { StudentEntity } from "./infrastructure/adapters/secondary/persistence/entities/student.entity";
import { StudentService } from "./domain/ports/inbound/student.service";
import { StudentServiceImpl } from "./application/service/student.impl";
import { PreRegistrationRepository } from "./domain/ports/outbound/pre-registration.repository";
import { PreRegistrationRepositoryImpl } from "./infrastructure/adapters/secondary/persistence/repositories/pre-registration.repository.impl";
import { PreRegistrationEntity } from "./infrastructure/adapters/secondary/persistence/entities/pre-registration.entity";
import { RepresentativeEntity } from "./infrastructure/adapters/secondary/persistence/entities/representative.entity";
import { PostulantEntity } from "./infrastructure/adapters/secondary/persistence/entities/postulant.entity";
import { PreRegistrationService } from "./domain/ports/inbound/pre-registration.service";
import { PreRegistrationServiceImpl } from "./application/service/pre-registration.impl";
import { PreRegistrationController } from "./infrastructure/adapters/primary/controllers/pre-registration.controller";
import { SegipService } from "./domain/ports/outbound/segip.service";
import { SegipServiceImpl } from "./infrastructure/adapters/secondary/services/segip/segip.service.impl";
import { HttpModule } from "@nestjs/axios";
import { LevelEntity } from "./infrastructure/adapters/secondary/persistence/entities/level.entity";
import { HistoryPreRegistrationEntity } from "./infrastructure/adapters/secondary/persistence/entities/history-pre-registration.entity";
import { PdfService } from "./domain/ports/outbound/pdf.service";
import { PdfServiceImpl } from "./infrastructure/adapters/secondary/services/pdf/pdf.service.impl";
import { PreRegistrationBrotherEntity } from "./infrastructure/adapters/secondary/persistence/entities/pre-registration-brother.entity";
import { PreRegistrationLocationEntity } from "./infrastructure/adapters/secondary/persistence/entities/pre-registration-location.entity";



@Module({
  controllers: [CatalogsController, PreRegistrationController],
  providers: [
    {
      provide: CatalogsService,
      useClass: CatalogsServiceImpl,
    },
    {
      provide: CatalogsRepository,
      useClass: CatalogsRepositoryImpl
    },
    {
      provide: StudentService,
      useClass: StudentServiceImpl
    },
    {
      provide: StudentRepository,
      useClass: StudentRepositoryImpl
    },
    {
      provide: PreRegistrationRepository,
      useClass: PreRegistrationRepositoryImpl
    },
    {
      provide: PreRegistrationService,
      useClass: PreRegistrationServiceImpl
    },
    {
      provide: SegipService,
      useClass: SegipServiceImpl
    },
    {
      provide: PdfService,
      useClass: PdfServiceImpl
    }
  ],
  imports : [
    HttpModule,
    TypeOrmModule.forFeature([
      RelationshipEntity,
      CriteriaEntity,
      PlaceTypeEntity,
      StudentEntity,
      PreRegistrationEntity,
      PreRegistrationBrotherEntity,
      PreRegistrationLocationEntity,
      RepresentativeEntity,
      PostulantEntity,
      LevelEntity,
      HistoryPreRegistrationEntity
    ], 'alta_demanda')
  ]
})
export class PreRegistrationModule {}