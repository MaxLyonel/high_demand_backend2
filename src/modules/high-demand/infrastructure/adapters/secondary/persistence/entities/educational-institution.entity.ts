import { EducationalInstitution as EducationalInstitutionModel } from "src/modules/high-demand/domain/models/educational-institution.model";
import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity({ schema: 'public', name: 'institucioneducativa'})
export class EducationalInstitutionEntity {
  @PrimaryColumn()
  id: number

  @Column({name: 'institucioneducativa'})
  name: string

  @Column({ name: 'estadoinstitucion_tipo_id'})
  state: number


  static toDomain(entity: EducationalInstitutionEntity): EducationalInstitutionModel {
    return EducationalInstitutionModel.create({
      id: entity.id,
      name: entity.name,
      state: entity.state
    })
  }

  static fromDomain(educationalInstitution: EducationalInstitutionModel): EducationalInstitutionEntity {
    const entity = new EducationalInstitutionEntity()
    entity.id = educationalInstitution.id
    entity.name = educationalInstitution.name
    entity.state = educationalInstitution.state
    return entity
  }
}