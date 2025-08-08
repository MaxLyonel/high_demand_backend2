// framework
import { Module } from "@nestjs/common";
// external dependencies
import { TypeOrmModule } from "@nestjs/typeorm";
// own implementation
import { EducationalInstitutionController } from "./infrastructure/adapters/primary/controllers/educational-institution.controller";
import { EducationalInstitutionEntity } from "./infrastructure/adapters/secondary/persistence/entities/educational-institution.entity";
import { EducationalInstitutionImpl } from "./application/service/educational-institution.impl";
import { EducationalInstitutionRepository } from "./domain/ports/outbound/educational-institution.repository";
import { EducationalInstitutionService } from "./domain/ports/inbound/educational-institution.service";
import { EducationalInstitutionRepositoryImpl } from './infrastructure/adapters/secondary/persistence/repositories/educational-institution.repository.impl';
import { EducationalInstitutionCourseController } from "./infrastructure/adapters/primary/controllers/educational-institution-course.controller";
import { EducationalInstitutionCourseService } from "./domain/ports/inbound/educational-institution-course.service";
import { EducationalInstitutionCourseImpl } from "./application/service/educational-institution-course.impl";
import { EducationalInstitutionCourseEntity } from "./infrastructure/adapters/secondary/persistence/entities/educational-institution-course.entity";
import { EducationalInstitutionCourseRepository } from "./domain/ports/outbound/educational-institution-course.repository";
import { EducationalInstitutionCourseRepositoryImpl } from './infrastructure/adapters/secondary/persistence/repositories/educational.institution-course.repository.impl';
import { HighDemandService } from "./domain/ports/inbound/high-demand.service";
import { HighDemandRegistrationImpl } from "./application/service/high-demand.impl";
import { HighDemandRepository } from "./domain/ports/outbound/high-demand.repository";
import { HighDemandRegistrationEntity } from "./infrastructure/adapters/secondary/persistence/entities/high-demand.entity";
import { HighDemandController } from "./infrastructure/adapters/primary/controllers/high-demand.controller";
import { HighDemandRepositoryImpl } from "./infrastructure/adapters/secondary/persistence/repositories/high-demand.repository.impl";
import { HighDemandCourseService } from "./domain/ports/inbound/high-demand-course.service";
import { HighDemanCourseImpl } from "./application/service/high-demand-course.impl";
import { HighDemandCourseRepository } from "./domain/ports/outbound/high-demand-course.repository";
import { HighDemandCourseRepositoryImpl } from './infrastructure/adapters/secondary/persistence/repositories/high-demand-course.repository.impl';
import { HighDemandRegistrationCourseEntity } from "./infrastructure/adapters/secondary/persistence/entities/high-demand-course.entity";



@Module({
  controllers: [
    EducationalInstitutionController,
    EducationalInstitutionCourseController,
    HighDemandController
  ],
  providers: [
    {
      provide: EducationalInstitutionRepository,
      useClass: EducationalInstitutionRepositoryImpl
    },
    {
      provide: EducationalInstitutionService,
      useClass: EducationalInstitutionImpl
    },
    {
      provide: EducationalInstitutionCourseRepository,
      useClass: EducationalInstitutionCourseRepositoryImpl
    },
    {
      provide: EducationalInstitutionCourseService,
      useClass: EducationalInstitutionCourseImpl
    },
    {
      provide: HighDemandService,
      useClass: HighDemandRegistrationImpl
    },
    {
      provide: HighDemandRepository,
      useClass: HighDemandRepositoryImpl
    },
    {
      provide: HighDemandCourseService,
      useClass: HighDemanCourseImpl,
    },
    {
      provide: HighDemandCourseRepository,
      useClass: HighDemandCourseRepositoryImpl
    }
  ],
  imports: [
    TypeOrmModule.forFeature(
      [
        EducationalInstitutionEntity,
        EducationalInstitutionCourseEntity,
        HighDemandRegistrationEntity,
        HighDemandRegistrationCourseEntity
      ], 'alta_demanda')
  ],
  exports: [EducationalInstitutionService]
})
export class HighDemandModule {}