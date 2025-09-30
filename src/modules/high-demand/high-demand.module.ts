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
import { WorkflowEntity } from "./infrastructure/adapters/secondary/persistence/entities/workflow.entity";
import { WorkflowRepository } from "./domain/ports/outbound/workflow.repository";
import { WorkflowRepositoryImpl } from "./infrastructure/adapters/secondary/persistence/repositories/workflow.repository.impl";
import { WorkflowStateEntity } from "./infrastructure/adapters/secondary/persistence/entities/workflow-state.entity";
import { WorkflowStateRepository } from "./domain/ports/outbound/workflow-state.repository";
import { HighDemandCourseController } from "./infrastructure/adapters/primary/controllers/high-demand-course.controller";
import { WorkflowStateRepositoryImpl } from "./infrastructure/adapters/secondary/persistence/repositories/workflow-state.repository.impl";
import { HistoryEntity } from "./infrastructure/adapters/secondary/persistence/entities/history.entity";
import { HistoryRepository } from "./domain/ports/outbound/history.repository";
import { HistoryRepositoryImpl } from "./infrastructure/adapters/secondary/persistence/repositories/history.repository.impl";
import { HistoryController } from "./infrastructure/adapters/primary/controllers/history.controller";
import { HistoryService } from "./domain/ports/inbound/history.service";
import { HistoryServiceImpl } from "./application/service/history.impl";
import { UnitOfWork } from './domain/ports/outbound/unit-of-work';
import { TypeOrmUnitOfWork } from "./infrastructure/adapters/secondary/persistence/repositories/typeorm-unit-of-work.impl";
import { WorkflowSequenceEntity } from "./infrastructure/adapters/secondary/persistence/entities/workflow-sequence.entity";
import { WorkflowSequenceRepository } from "./domain/ports/outbound/workflow-sequence.repository";
import { WorkflowSequenceRepositoryImpl } from "./infrastructure/adapters/secondary/persistence/repositories/workflow-sequence.repository.impl";
import { RolRepository } from "@access-control/domain/ports/outbound/rol.repository";
import { RolRepositoryImpl } from "@access-control/infrastructure/adapters/secondary/persistence/repositories/rol.repository.impl";
import { UserRepository } from "@access-control/domain/ports/outbound/user.repository";
import { UserRepositoryImpl } from "@access-control/infrastructure/adapters/secondary/persistence/repositories/user.repository.impl";
import { RolTypeEntity } from "@access-control/infrastructure/adapters/secondary/persistence/entities/rol-type.entity";
import { UserEntity } from "@access-control/infrastructure/adapters/secondary/persistence/entities/user.entity";
import { TeacherEntity } from "@access-control/infrastructure/adapters/secondary/persistence/entities/teacher.entity";
import { GeographicJurisdictionEntity } from "../pre-registration/infrastructure/adapters/secondary/persistence/entities/geographic-jurisdiction.entity";
import { OperationsProgrammingModule } from "../operations-programming/operations-programming.module";
import { PlaceTypeEntity } from "@pre-registration/infrastructure/adapters/secondary/persistence/entities/place-type.entity";
import { MainInboxRepository } from "./domain/ports/outbound/main-inbox.repository";
import { MainInboxRepositoryImpl } from "./infrastructure/adapters/secondary/persistence/repositories/main-inbox.repository.impl";
import { MainInboxController } from "./infrastructure/adapters/primary/controllers/main-inbox.controller";
import { MainInboxService } from "./domain/ports/inbound/main-inbox.service";
import { MainInboxImpl } from "./application/service/main-inbox.impl";



@Module({
  controllers: [
    EducationalInstitutionController,
    EducationalInstitutionCourseController,
    HighDemandController,
    HighDemandCourseController,
    HistoryController,
    MainInboxController
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
    },
    {
      provide: WorkflowRepository,
      useClass: WorkflowRepositoryImpl
    },
    {
      provide: WorkflowStateRepository,
      useClass: WorkflowStateRepositoryImpl
    },
    {
      provide: HistoryRepository,
      useClass: HistoryRepositoryImpl
    },
    {
      provide: HistoryService,
      useClass: HistoryServiceImpl
    },
    {
      provide: UnitOfWork,
      useClass: TypeOrmUnitOfWork
    },
    {
      provide: WorkflowSequenceRepository,
      useClass: WorkflowSequenceRepositoryImpl
    },
    {
      provide: RolRepository,
      useClass: RolRepositoryImpl
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl
    },
    {
      provide: MainInboxRepository,
      useClass: MainInboxRepositoryImpl
    },
    {
      provide: MainInboxService,
      useClass: MainInboxImpl
    }
  ],
  imports: [
    TypeOrmModule.forFeature(
      [
        EducationalInstitutionCourseEntity,
        EducationalInstitutionEntity,
        GeographicJurisdictionEntity,
        HighDemandRegistrationCourseEntity,
        HighDemandRegistrationEntity,
        HistoryEntity,
        PlaceTypeEntity,
        RolTypeEntity,
        TeacherEntity,
        UserEntity,
        WorkflowEntity,
        WorkflowSequenceEntity,
        WorkflowStateEntity,
      ], 'alta_demanda'),
    OperationsProgrammingModule
  ],
  exports: [EducationalInstitutionService]
})
export class HighDemandModule {}