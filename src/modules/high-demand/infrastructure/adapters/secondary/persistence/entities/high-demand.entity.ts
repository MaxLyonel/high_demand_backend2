import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EducationalInstitutionEntity } from "./educational-institution.entity";
import { HighDemandRegistration as HighDemandRegistrationModel } from "@high-demand/domain/models/high-demand-registration.model"
import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum"
import { HighDemandRegistrationCourse } from '../../../../../domain/models/high-demand-registration-course.model';
import { HighDemandRegistrationCourseEntity } from "./high-demand-course.entity";


@Entity({ schema: 'alta_demanda', name: 'inscripcion_alta_demanda'})
export class HighDemandRegistrationEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'institucioneducativa_id'})
  educationalInstitutionId: number

  @Column({ name: 'usuario_id'})
  userId: number

  @Column({ name: 'estado_actual_flujo'})
  currentWorkflowState: string

  @Column({ name: 'flujo_id'})
  workflowId: number

  @Column({name: 'estado_inscripcion'})
  registrationStatus: RegistrationStatus

  @Column({ name: 'bandeja'})
  inbox: boolean

  @Column({ name: 'operativo_id'})
  operativeId: number

  @ManyToOne(() => EducationalInstitutionEntity)
  @JoinColumn({ name: 'institucioneducativa_id'})
  educationalInstitution: EducationalInstitutionEntity

  @OneToMany(
    () => HighDemandRegistrationCourseEntity,
    course => course.highDemandRegistration,
    { cascade: true }
  )
  highDemandCourses: HighDemandRegistrationCourseEntity[];

  static toDomain(entity: HighDemandRegistrationEntity): HighDemandRegistrationModel {
    return new HighDemandRegistrationModel(
      entity.id,
      entity.educationalInstitutionId,
      entity.userId,
      entity.currentWorkflowState,
      entity.workflowId,
      entity.registrationStatus,
      entity.inbox,
      entity.operativeId,
      entity.highDemandCourses
        ? entity.highDemandCourses.map(course =>
            HighDemandRegistrationCourse.toDomain(course) // convierte cada curso al modelo de dominio
          )
        : []
    );
  }

  static fromDomain(highDemanRegistration:HighDemandRegistrationModel): HighDemandRegistrationEntity {
    const entity = new HighDemandRegistrationEntity()
    entity.id = highDemanRegistration.id,
    entity.educationalInstitutionId = highDemanRegistration.educationalInstitutionId,
    entity.userId = highDemanRegistration.userId,
    entity.currentWorkflowState = highDemanRegistration.currentWorkflowState,
    entity.workflowId = highDemanRegistration.workflowId,
    entity.registrationStatus = highDemanRegistration.registrationStatus,
    entity.inbox = highDemanRegistration.inbox
    entity.operativeId = highDemanRegistration.operativeId
    return entity
  }
}