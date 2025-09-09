import { Level as LevelModel } from "@high-demand/domain/models/level.model";
import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity({ schema: 'public', name: 'nivel_tipo'})
export class LevelTypeEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'nivel'})
  name: string

  static toDomain(entity: LevelTypeEntity): LevelModel {
    return new LevelModel(
      entity.id,
      entity.name
    )
  }
}