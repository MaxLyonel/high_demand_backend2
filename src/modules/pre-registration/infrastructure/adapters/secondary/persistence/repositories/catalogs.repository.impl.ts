import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CatalogsRepository } from "src/modules/pre-registration/domain/ports/outbound/catalogs.repository";
import { In, Repository } from "typeorm";
import { CriteriaEntity } from "../entities/criteria.entity";
import { RelationshipEntity } from "../entities/relationship.entity";
import { PlaceTypeEntity } from "../entities/place-type.entity";
import { LevelEntity } from "../entities/level.entity";

@Injectable()
export class CatalogsRepositoryImpl implements CatalogsRepository {

  constructor(
    @InjectRepository(RelationshipEntity, 'alta_demanda')
    private readonly relationShipRepository: Repository<RelationshipEntity>,
    @InjectRepository(CriteriaEntity, 'alta_demanda')
    private readonly criteriaRepository: Repository<CriteriaEntity>,
    @InjectRepository(PlaceTypeEntity, 'alta_demanda')
    private readonly placeRepository: Repository<PlaceTypeEntity>,
    @InjectRepository(LevelEntity, 'alta_demanda')
    private readonly levelRepository: Repository<LevelEntity>
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

  // *** obtener el catálogo de municipios ***
  async getMunicipies(): Promise<any> {
    const municipies = await this.placeRepository.find({
      where: {
        placeLevelId: 3
      }
    })
    return municipies
  }

  // ** obtener el catálogo de niveles de educación
  async getLevels(): Promise<any> {
    const levels = await this.levelRepository.find({
      where: {
        id: In([11, 12, 13])
      }
    })
    return levels
  }

  // ** obtener el catálogo de departamentos **
  async getDepartments(): Promise<any> {
    const departments = await this.placeRepository.find({
      where: {
        placeLevelId: 1
      }
    })
    return departments
  }

  async getDistrictByDepartment(departmentId: number): Promise<any> {
    const districts = await this.placeRepository.find({
      where: {
        parentId: departmentId
      }
    })
    return districts
  }

}