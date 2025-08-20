import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity({ name: 'estudiante'})
export class StudentEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'codigo_rude'})
  codeRude: string

  @Column({ name: 'nombre'})
  name: string

  @Column({ name: 'paterno'})
  lastName: string

  @Column({ name: 'materno'})
  mothersLastName: string

  @Column({ name: 'carnet_identidad'})
  identityCard: string
}