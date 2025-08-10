import { Teacher as TeacherModel} from "@access-control/domain/models/teacher.model";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'maestro_inscripcion'})
export class TeacherEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'cargo_tipo_id'})
  positionTypeId: number

  @Column({ name: 'institucioneducativa_id'})
  educationalInstitutionId: number

  @Column({ name: 'persona_id'})
  personId: number

  @Column({ name: 'gestion_tipo_id'})
  gestionId: number

  @Column({ name: 'es_vigente_administrativo'})
  isVigentAdmin: boolean


  static toDomain(entity: TeacherEntity): TeacherModel {
    return TeacherModel.create({
      id: entity.id,
      positionTypeId: entity.positionTypeId,
      educationalInstitutionId: entity.educationalInstitutionId,
      personId: entity.personId,
      gestionId: entity.gestionId,
      isVigentAdmin: entity.isVigentAdmin
    })
  }

}