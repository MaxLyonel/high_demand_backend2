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
    }
  ],
  imports : [
    TypeOrmModule.forFeature([
      RelationshipEntity,
      CriteriaEntity,
      PlaceTypeEntity
    ], 'alta_demanda')
  ]
})
export class PreRegistrationModule {}