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



@Module({
  controllers: [CatalogsController],
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
    }
  ],
  imports : [
    TypeOrmModule.forFeature([
      RelationshipEntity,
      CriteriaEntity,
      PlaceTypeEntity,
      StudentEntity
    ], 'alta_demanda')
  ]
})
export class PreRegistrationModule {}