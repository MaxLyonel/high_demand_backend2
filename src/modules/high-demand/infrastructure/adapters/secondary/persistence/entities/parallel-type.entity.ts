import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity({ schema: 'public', name: 'paralelo_tipo'})
export class ParallelTypeEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'paralelo'})
  name: string
}