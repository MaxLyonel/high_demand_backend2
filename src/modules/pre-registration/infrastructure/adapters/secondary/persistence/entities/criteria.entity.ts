import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ schema: 'alta_demanda', name: 'criterio'})
export class CriteriaEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'nombre'})
  name: string

  @Column({ name: 'descripcion'})
  description: string
}