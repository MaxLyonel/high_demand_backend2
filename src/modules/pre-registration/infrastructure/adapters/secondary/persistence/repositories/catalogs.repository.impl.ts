import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CatalogsRepository } from "src/modules/pre-registration/domain/ports/outbound/catalogs.repository";
import { Repository } from "typeorm";
import { CriteriaEntity } from "../entities/criteria.entity";
import { RelationshipEntity } from "../entities/relationship.entity";
import { PlaceTypeEntity } from "../entities/place-type.entity";

@Injectable()
export class CatalogsRepositoryImpl implements CatalogsRepository {

  constructor(
    @InjectRepository(RelationshipEntity, 'alta_demanda')
    private readonly relationShipRepository: Repository<RelationshipEntity>,
    @InjectRepository(CriteriaEntity, 'alta_demanda')
    private readonly criteriaRepository: Repository<CriteriaEntity>,
    @InjectRepository(PlaceTypeEntity, 'alta_demanda')
    private readonly placeRepository: Repository<PlaceTypeEntity>
  ){}

  // *** obtener el catálogo de parentesco ***
  async getRelationship(): Promise<any> {
    const relationships = await this.relationShipRepository.find({
      where: {
        active: true
      }
    })
    return relationships
  }

  // *** obtener el catálogo de criterios ***
  async getCriterias(): Promise<any> {
    const criterias = await this.criteriaRepository.find()
    return criterias
  }

  async getMunicipies(): Promise<any> {
    throw new Error('Method not implemented')
    // const municipies = await this.placeRepository.find({
    //   where: {
    //     placeLevelId: 
    //   }
    // })
  }

}