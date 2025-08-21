import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({ schema: 'alta_demanda', name: 'postulante'})
export class PostulantEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'carnet_identidad'})
  identityCard: string

  @Column({ name: 'paterno'})
  lastName: string

  @Column({ name: 'materno'})
  mothersLastName: string

  @Column({ name: 'nombre' })
  name: string

  @Column({ name: 'fecha_nacimiento'})
  dateBirth: Date

  @Column({ name: 'lugar_nacimiento'})
  placeBirth: string

  @Column({ name: 'genero'})
  gender: string

  @Column({ name: 'codigo_rude'})
  codeRude: string

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamp'})
  updatedAt: Date;

  @DeleteDateColumn({ name: 'eliminado_en', type: 'timestamp'})
  deletedAt?: Date;

}