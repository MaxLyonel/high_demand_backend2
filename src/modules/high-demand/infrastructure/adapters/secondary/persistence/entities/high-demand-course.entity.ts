// framework nestjs
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
// own implementations
import { HighDemandRegistrationCourse as HighDemandRegistrationCourseModel } from "@high-demand/domain/models/high-demand-registration-course.model"
import { HighDemandRegistrationEntity } from "./high-demand.entity";
import { LevelTypeEntity } from "./leve-type.entity";
import { GradeTypeEntity } from "./grade-type.entity";
import { ParallelTypeEntity } from './parallel-type.entity';


@Entity({ schema: 'alta_demanda', name: 'alta_demanda_curso'})
export class HighDemandRegistrationCourseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'inscripcion_alta_demanda_id'})
  highDemandRegistrationId: number

  @Column({ name: 'nivel_id'})
  levelId: number

  @Column({ name: 'grado_id'})
  gradeId: number

  @Column({ name: 'paralelo_id'})
  parallelId: number

  @Column({ name: 'plazas_totales'})
  totalQuota: number

  @ManyToOne(() => HighDemandRegistrationEntity)
  @JoinColumn({ name: 'inscripcion_alta_demanda_id'})
  highDemandRegistration: HighDemandRegistrationEntity

  @ManyToOne(() => LevelTypeEntity)
  @JoinColumn({ name: 'nivel_id'})
  level: LevelTypeEntity

  @ManyToOne(() => GradeTypeEntity)
  @JoinColumn({ name: 'grado_id'})
  grade: GradeTypeEntity

  @ManyToOne(() => ParallelTypeEntity)
  @JoinColumn({ name: 'paralelo_id'})
  parallel: ParallelTypeEntity

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'eliminado_en', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  static toDomain(entity: HighDemandRegistrationCourseEntity): HighDemandRegistrationCourseModel {
    return new HighDemandRegistrationCourseModel(
      entity.id,
      entity.highDemandRegistrationId,
      entity.levelId,
      entity.gradeId,
      entity.parallelId,
      entity.totalQuota,
      entity.level ? LevelTypeEntity.toDomain(entity.level) : undefined,
      entity.grade ? GradeTypeEntity.toDomain(entity.grade) : undefined,
      entity.parallel ? ParallelTypeEntity.toDomain(entity.parallel) : undefined
    )
  }

  static fromDomain(highDemandRegistrationCourse: HighDemandRegistrationCourseModel): HighDemandRegistrationCourseEntity {
    const entity = new HighDemandRegistrationCourseEntity()
    entity.highDemandRegistrationId = highDemandRegistrationCourse.highDemandRegistrationId;
    entity.levelId = highDemandRegistrationCourse.levelId;
    entity.gradeId = highDemandRegistrationCourse.gradeId;
    entity.parallelId = highDemandRegistrationCourse.parallelId;
    entity.totalQuota = highDemandRegistrationCourse.totalQuota;
    return entity
  }
}