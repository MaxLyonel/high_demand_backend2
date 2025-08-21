import { HighDemandRegistrationCourseEntity } from "@high-demand/infrastructure/adapters/secondary/persistence/entities/high-demand-course.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RepresentativeEntity } from "./representative.entity";
import { PostulantEntity } from "./postulant.entity";
import { CriteriaEntity } from "./criteria.entity";
import { PreRegistrationStatus } from "@pre-registration/domain/enums/pre-registration-status.enum";



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

  @Column({
    name: 'estado',
    type: 'enum',
    enum: PreRegistrationStatus,
  })
  state: PreRegistrationStatus;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamp'})
  updatedAt: Date;

  @DeleteDateColumn({ name: 'eliminado_en', type: 'timestamp'})
  deletedAt?: Date;

}