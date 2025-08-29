import { Criteria } from "@pre-registration/domain/models/criteria.model";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ schema: 'alta_demanda', name: 'criterio'})
export class CriteriaEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'nombre'})
  name: string

  @Column({ name: 'descripcion'})
  description: string

  @Column({ name: 'activo'})
  active: boolean

  static toDomain(entity: CriteriaEntity): Criteria {
    return new Criteria(
      entity.id,
      entity.name,
      entity.description,
      entity.active
    )
  }
}