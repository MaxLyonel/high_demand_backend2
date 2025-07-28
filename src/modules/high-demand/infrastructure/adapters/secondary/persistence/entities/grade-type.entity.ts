import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity({ schema: 'public', name: 'grado_tipo'})
export class GradeTypeEntity {
  @PrimaryColumn()
  id: number

  @Column({name: 'grado'})
  name: string
}