// framework
import { Module } from "@nestjs/common";
// external dependencies
import { TypeOrmModule } from "@nestjs/typeorm";
// own implementation
import { EducationalInstitutionController } from "./infrastructure/adapters/primary/controllers/educational-institution.controller";
import { EducationalInstitutionEntity } from "./infrastructure/adapters/secondary/persistence/entities/educational-institution.entity";
import { EducationalInstitutionImpl } from "./application/service/educational-institution.impl";
import { EducationalInstitutionRepository } from "./application/ports/outbound/educational-institution.repository";
import { EducationalInstitutionService } from "./application/ports/inbound/educational-institution.service";
import { EducationalInstitutionRepositoryImpl } from './infrastructure/adapters/secondary/persistence/repositories/educational-institution.repository.impl';
import { EducationalInstitutionCourseController } from "./infrastructure/adapters/primary/controllers/educational-institution-course.controller";
import { EducationalInstitutionCourseService } from "./application/ports/inbound/educational-institution-course.service";
import { EducationalInstitutionCourseImpl } from "./application/service/educational-institution-course.impl";
import { EducationalInstitutionCourseEntity } from "./infrastructure/adapters/secondary/persistence/entities/educational-institution-course.entity";
import { EducationalInstitutionCourseRepository } from "./application/ports/outbound/educational-institution-course.repository";
import { EducationalInstitutionCourseRepositoryImpl } from './infrastructure/adapters/secondary/persistence/repositories/educational.institution-course.repository.impl';



@Module({
  controllers: [
    EducationalInstitutionController,
    EducationalInstitutionCourseController
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
    }
  ],
  imports: [
    TypeOrmModule.forFeature(
      [
        EducationalInstitutionEntity,
        EducationalInstitutionCourseEntity
      ], 'alta_demanda')
  ],
  exports: [EducationalInstitutionService]
})
export class HighDemandModule {}