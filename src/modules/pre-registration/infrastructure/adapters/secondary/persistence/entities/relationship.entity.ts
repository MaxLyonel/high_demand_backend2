import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity({ schema: 'alta_demanda', name: 'parentesco'})
export class RelationshipEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'nombre'})
  name: string

  @Column({ name: 'activo'})
  active: boolean
}