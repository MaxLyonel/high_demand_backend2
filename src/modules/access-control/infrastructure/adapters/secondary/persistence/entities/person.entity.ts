import { Column, Entity, PrimaryColumn } from "typeorm";



@Entity({ name: 'persona'})
export class PersonEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'carnet'})
  identityCard: string

  @Column({ name: 'paterno'})
  lastName: string

  @Column({ name: 'materno'})
  mothersLastName: string

  @Column({ name: 'nombre'})
  name: string

}