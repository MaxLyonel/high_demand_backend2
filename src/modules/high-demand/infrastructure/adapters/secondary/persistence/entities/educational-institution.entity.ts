// external dependencies
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
// own implementations
import { EducationalInstitution as EducationalInstitutionModel } from "@high-demand/domain/models/educational-institution.model"
import { EducationalInstitutionStateEntity } from "./educational-institution-state.entity";
import { EducationalInstitutionTypeEntity } from "./educational-institution-type.entity";
import { DependencyTypeEntity } from "./dependency-type.entity";
import { GeographicJurisdictionEntity } from "@pre-registration/infrastructure/adapters/secondary/persistence/entities/geographic-jurisdiction.entity"


@Entity({ schema: 'public', name: 'institucioneducativa'})
export class EducationalInstitutionEntity {
  @PrimaryColumn()
  id: number

  @Column({name: 'institucioneducativa'})
  name: string

  @ManyToOne(() => EducationalInstitutionStateEntity, { eager: false })
  @JoinColumn({ name: 'estadoinstitucion_tipo_id'})
  state: EducationalInstitutionStateEntity

  @ManyToOne(() => GeographicJurisdictionEntity, { eager: false })
  @JoinColumn({ name: 'le_juridicciongeografica_id'})
  jurisdiction: GeographicJurisdictionEntity

  @ManyToOne(() => DependencyTypeEntity, { eager: false})
  @JoinColumn({ name: 'dependencia_tipo_id'})
  dependencyType: DependencyTypeEntity

  @ManyToOne(() => EducationalInstitutionTypeEntity, { eager: false })
  @JoinColumn({ name: 'institucioneducativa_tipo_id'})
  educationalInstitutionType: EducationalInstitutionTypeEntity


  static toDomain(entity: EducationalInstitutionEntity): EducationalInstitutionModel {
    return EducationalInstitutionModel.create({
      id: entity.id,
      name: entity.name,
      state: entity.state ? { id: entity.state.id, name: entity.state.state, obs: entity.state.obs } : null,
      educationalInstitutionType:
        entity.educationalInstitutionType ? { id: entity.educationalInstitutionType.id, name: entity.educationalInstitutionType.description } : null,
      jurisdiction: entity.jurisdiction ? { id: entity.jurisdiction.id, localityPlaceType: entity.jurisdiction.localityPlaceType,
        districtPlaceType: entity.jurisdiction.districtPlaceType, direction: entity.jurisdiction.direction, area: entity.jurisdiction.area
      } : null
    })
  }

  static fromDomain(educationalInstitution: EducationalInstitutionModel): EducationalInstitutionEntity {
    const entity = new EducationalInstitutionEntity()
    entity.id = educationalInstitution.id
    entity.name = educationalInstitution.name
    entity.state = { id: educationalInstitution.state.id, state: educationalInstitution.state.state, obs: entity.state.obs }
    entity.educationalInstitutionType = { id: educationalInstitution.educationalInstitutionType.id, description: educationalInstitution.educationalInstitutionType.description }
    return entity
  }
}