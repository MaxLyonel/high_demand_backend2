import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'estadoinstitucion_tipo'})
export class EducationalInstitutionStateEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'estadoinstitucion'})
  state: string

  @Column({ name: 'obs_cerrada'})
  obs: string
}