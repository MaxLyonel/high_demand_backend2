import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EducationalInstitutionEntity } from "./educational-institution.entity";
import { HighDemandRegistration as HighDemandRegistrationModel } from "@high-demand/domain/models/high-demand-registration.model"
import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum"
import { HighDemandRegistrationCourse } from '../../../../../domain/models/high-demand-registration-course.model';
import { HighDemandRegistrationCourseEntity } from "./high-demand-course.entity";
import { HistoryEntity } from "./history.entity";
import { PlaceTypeEntity } from "./place-type.entity";


@Entity({ schema: 'alta_demanda', name: 'inscripcion_alta_demanda'})
export class HighDemandRegistrationEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'institucion_educativa_id'})
  educationalInstitutionId: number

  @Column({ name: 'usuario_id'})
  userId: number

  @Column({ name: 'flujo_estado_id'})
  workflowStateId: number

  @Column({ name: 'flujo_id'})
  workflowId: number

  @Column({
    name: 'inscripcion_estado',
    type: 'enum',
    enum: RegistrationStatus
  })
  registrationStatus: RegistrationStatus

  @Column({ name: 'bandeja_estado'})
  inbox: boolean

  @Column({ name: 'operativo_id'})
  operativeId: number

  @Column({ name: 'rol_id'})
  rolId: number

  @ManyToOne(() => EducationalInstitutionEntity)
  @JoinColumn({ name: 'institucion_educativa_id'})
  educationalInstitution: EducationalInstitutionEntity

  @OneToMany(
    () => HighDemandRegistrationCourseEntity,
    course => course.highDemandRegistration,
    { cascade: true }
  )
  courses: HighDemandRegistrationCourseEntity[];

  @OneToMany(() => HistoryEntity, (history) => history.highDemandRegistration)
  histories: HistoryEntity[];

  @ManyToOne(() => PlaceTypeEntity)
  @JoinColumn({ name: 'lugar_distrito_id'})
  placeDistrict: PlaceTypeEntity

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamp'})
  updatedAt: Date;

  @DeleteDateColumn({ name: 'eliminado_en', type: 'timestamp'})
  deletedAt?: Date;


  static toDomain(entity: HighDemandRegistrationEntity): HighDemandRegistrationModel {
    return new HighDemandRegistrationModel(
      entity.id,
      entity.educationalInstitutionId,
      entity.userId,
      entity.workflowStateId,
      entity.workflowId,
      entity.registrationStatus,
      entity.inbox,
      entity.operativeId,
      entity.rolId,
      entity.placeDistrict,
      entity.courses
        ? entity.courses.map(course =>
            HighDemandRegistrationCourseEntity.toDomain(course) // convierte cada curso al modelo de dominio
          )
        : []
    );
  }

  static fromDomain(highDemanRegistration:HighDemandRegistrationModel): HighDemandRegistrationEntity {
    const entity = new HighDemandRegistrationEntity()
    entity.id = highDemanRegistration.id,
    entity.educationalInstitutionId = highDemanRegistration.educationalInstitutionId,
    entity.userId = highDemanRegistration.userId,
    entity.workflowStateId = highDemanRegistration.workflowStateId,
    entity.workflowId = highDemanRegistration.workflowId,
    entity.registrationStatus = highDemanRegistration.registrationStatus,
    entity.inbox = highDemanRegistration.inbox
    entity.operativeId = highDemanRegistration.operativeId
    entity.rolId = highDemanRegistration.rolId
    entity.courses = highDemanRegistration.courses ?
      highDemanRegistration.courses.map(course =>
        HighDemandRegistrationCourseEntity.fromDomain(course)
      ) : []
    return entity
  }
}