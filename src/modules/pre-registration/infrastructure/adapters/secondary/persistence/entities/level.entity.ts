import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity({ name: 'nivel_tipo'})
export class LevelEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'nivel'})
  name: string
}