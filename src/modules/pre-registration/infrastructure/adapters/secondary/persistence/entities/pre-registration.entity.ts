import { HighDemandRegistrationCourseEntity } from "@high-demand/infrastructure/adapters/secondary/persistence/entities/high-demand-course.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RepresentativeEntity } from "./representative.entity";
import { PostulantEntity } from "./postulant.entity";
import { CriteriaEntity } from "./criteria.entity";
import { PreRegistrationStatus } from "@pre-registration/domain/enums/pre-registration-status.enum";
import { PreRegistration as PreRegistrationModel } from "@pre-registration/domain/models/pre-registration.model";
import { HighDemandRegistrationEntity } from "@high-demand/infrastructure/adapters/secondary/persistence/entities/high-demand.entity";



@Entity({ schema: 'alta_demanda', name: 'pre_inscripcion'})
export class PreRegistrationEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => HighDemandRegistrationCourseEntity, { eager: false})
  @JoinColumn({name: 'alta_demanda_curso_id'})
  highDemandCourse: HighDemandRegistrationCourseEntity

  @ManyToOne(() => RepresentativeEntity, { eager: false})
  @JoinColumn({ name: 'apoderado_id'})
  representative: RepresentativeEntity

  @ManyToOne(() => PostulantEntity, { eager: true })
  @JoinColumn({ name: 'postulante_id'})
  postulant: PostulantEntity

  @ManyToOne(() => CriteriaEntity, { eager: false })
  @JoinColumn({ name: 'criterio_id'})
  criteria: CriteriaEntity

  @ManyToOne(() => CriteriaEntity, { eager: false })
  @JoinColumn({ name: 'criterio_post_id'})
  criteriaPost: CriteriaEntity

  @Column({
    name: 'estado',
    type: 'enum',
    enum: PreRegistrationStatus,
  })
  state: PreRegistrationStatus;

  @Column({ name: 'codigo'})
  code: string

  @Column({ name: 'paralelo_seleccionado_id'})
  parallelSelectedId: number;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamp'})
  updatedAt: Date;

  @DeleteDateColumn({ name: 'eliminado_en', type: 'timestamp'})
  deletedAt?: Date;

  @Column({ name: 'actualizado'})
  isUpdated: boolean

  static toDomain(entity: PreRegistrationEntity): PreRegistrationModel {
    return new PreRegistrationModel(
      entity.id,
      HighDemandRegistrationCourseEntity.toDomain(entity.highDemandCourse),
      RepresentativeEntity.toDomain(entity.representative),
      PostulantEntity.toDomain(entity.postulant),
      CriteriaEntity.toDomain(entity.criteria),
      entity.state
    );
  }

  // static fromDomain(model: PreRegistrationModel): PreRegistrationEntity {
  //   const entity = new PreRegistrationEntity();
  //   entity.id = model.id;
  //   entity.highDemandCourseId = (model.highDemandCourseId as any).id ?? model.highDemandCourseId;
  //   entity.representativeId = (model.representativeId as any).id ?? model.representativeId;
  //   entity.postulantId = (model.postulantId as any).id ?? model.postulantId;
  //   entity.criteriaId = (model.criteriaId as any).id ?? model.criteriaId;
  //   entity.state = model.state;
  //   return entity;
  // }

}