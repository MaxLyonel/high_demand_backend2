// external dependencies
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
// Own implementations
import { EducationalInstitutionCourse as EducationalInstitutionCourseModel } from "@high-demand/domain/models/educational-institution-course.model"
import { GradeTypeEntity } from "./grade-type.entity";
import { LevelTypeEntity } from "./leve-type.entity";
import { ParallelTypeEntity } from "./parallel-type.entity";


@Entity({ schema: 'public', name: 'institucioneducativa_curso'})
export class EducationalInstitutionCourseEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'nivel_tipo_id'})
  levelTypeId: number

  @Column({ name: 'grado_tipo_id'})
  gradeTypeId: number

  @Column({ name: 'institucioneducativa_id'})
  educationalInstitutionId: number

  @Column({ name: 'paralelo_tipo_id'})
  parallelTypeId: number

  @Column({ name: 'gestion_tipo_id'})
  gestionTypeId: number

  @ManyToOne(() => LevelTypeEntity)
  @JoinColumn({ name: 'nivel_tipo_id' })
  levelType: LevelTypeEntity;

  @ManyToOne(() => GradeTypeEntity)
  @JoinColumn({ name: 'grado_tipo_id' })
  gradeType: GradeTypeEntity;

  @ManyToOne(() => ParallelTypeEntity)
  @JoinColumn({ name: 'paralelo_tipo_id' })
  parallelType: ParallelTypeEntity;


  static toDomain(entity: EducationalInstitutionCourseEntity): EducationalInstitutionCourseModel {
    return EducationalInstitutionCourseModel.create({
      id: entity.id,
      educationalInstitutionId: entity.educationalInstitutionId,
      levelTypeId: entity.levelTypeId,
      gradeTypeId: entity.gradeTypeId,
      parallelTypeId: entity.parallelTypeId,
      gestionTypeId: entity.gestionTypeId
    })
  }

  static fromDomain(educationalInstitutionCourse: EducationalInstitutionCourseModel): EducationalInstitutionCourseEntity {
    const entity = new EducationalInstitutionCourseEntity()
    entity.id = educationalInstitutionCourse.id
    entity.educationalInstitutionId = educationalInstitutionCourse.educationalInstitutionId
    entity.levelTypeId = educationalInstitutionCourse.levelTypeId
    entity.gradeTypeId = educationalInstitutionCourse.gradeTypeId
    entity.parallelTypeId = educationalInstitutionCourse.parallelTypeId
    entity.gestionTypeId = educationalInstitutionCourse.gestionTypeId
    return entity
  }
}