import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity({ name: 'institucioneducativa_tipo'})
export class EducationalInstitutionTypeEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'descripcion'})
  description: string
}