import { Parallel as ParallelModel } from "@high-demand/domain/models/parallel.model";
import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity({ schema: 'public', name: 'paralelo_tipo'})
export class ParallelTypeEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'paralelo'})
  name: string

  static toDomain(entity: ParallelTypeEntity): ParallelModel {
    return new ParallelModel(
      entity.id,
      entity.name
    )
  }
}