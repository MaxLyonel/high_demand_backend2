import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'dependencia_tipo'})
export class DependencyTypeEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'dependencia'})
  dependency: string
}