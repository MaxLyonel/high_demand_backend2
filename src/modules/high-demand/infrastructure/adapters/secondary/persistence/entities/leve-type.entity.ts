import { Column, Entity, PrimaryColumn } from "typeorm";



@Entity({ schema: 'public', name: 'nivel_tipo'})
export class LevelTypeEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'nivel'})
  name: string

}