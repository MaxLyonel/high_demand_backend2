// framework nestjs
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// own implementations
import { EducationalInstitutionCourseEntity } from "./educational-institution-course.entity";
import { HighDemandRegistrationCourse as HighDemandRegistrationCourseModel } from "@high-demand/domain/models/high-demand-registration-course.model"
import { HighDemandRegistrationEntity } from "./high-demand.entity";


@Entity({ schema: 'alta_demanda', name: 'alta_demanda_curso'})
export class HighDemandRegistrationCourseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'alta_demanda_inscripcion_id'})
  highDemandRegistrationId: number

  @Column({ name: 'institucion_curso_id'})
  educationalInstitutionCourseId: number

  @Column({ name: 'plazas_totales'})
  totalQuota: number

  @ManyToOne(() => HighDemandRegistrationEntity)
  @JoinColumn({ name: 'alta_demanda_inscripcion_id'})
  highDemandRegistration: HighDemandRegistrationEntity

  @ManyToOne(() => EducationalInstitutionCourseEntity)
  @JoinColumn({ name: 'institucion_curso_id'})
  educationalInstitutionCourse: EducationalInstitutionCourseEntity


  static toDomain(entity: HighDemandRegistrationCourseEntity): HighDemandRegistrationCourseModel {
    return HighDemandRegistrationCourseModel.create({
      id: entity.id,
      highDemandRegistrationId: entity.highDemandRegistrationId,
      educationalInstitutionCourseId: entity.educationalInstitutionCourseId,
      totalQuota: entity.totalQuota
    })
  }

  static fromDomain(highDemandRegistrationCourse: HighDemandRegistrationCourseModel): HighDemandRegistrationCourseEntity {
    const entity = new HighDemandRegistrationCourseEntity()
    entity.id = highDemandRegistrationCourse.id
    entity.highDemandRegistrationId = highDemandRegistrationCourse.educationalInstitutionCourseId,
    entity.educationalInstitutionCourseId = highDemandRegistrationCourse.educationalInstitutionCourseId,
    entity.totalQuota = highDemandRegistrationCourse.totalQuota
    return entity
  }
}