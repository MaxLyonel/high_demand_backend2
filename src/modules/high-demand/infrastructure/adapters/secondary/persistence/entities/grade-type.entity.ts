import { Grade as GradeModel } from "@high-demand/domain/models/grade.model";
import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity({ schema: 'public', name: 'grado_tipo'})
export class GradeTypeEntity {
  @PrimaryColumn()
  id: number

  @Column({name: 'grado'})
  name: string

  static toDomain(entity: GradeTypeEntity): GradeModel {
    return new GradeModel(
      entity.id,
      entity.name
    )
  }
}