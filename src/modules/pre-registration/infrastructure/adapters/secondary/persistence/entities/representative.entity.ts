import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RelationshipEntity } from "./relationship.entity";
import { WorkRepresentativeEntity } from "./work-representative.entity";


@Entity({ schema: 'alta_demanda', name: 'apoderado'})
export class RepresentativeEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'carnet_identidad' })
  identityCard: string

  @Column({ name: 'complemento'})
  complement: string

  @Column({ name: 'paterno' })
  lastName: string

  @Column({ name: 'materno' })
  mothersLastName: string

  @Column({ name: 'nombre' })
  name: string

  @Column({ name: 'fecha_nacimiento'})
  dateBirth: Date

  @Column({ name: 'nacionalidad'})
  nationality: boolean

  @ManyToOne(() => RelationshipEntity, { eager: false })
  @JoinColumn({ name: 'parentesco_tipo_id'})
  relationshipType: RelationshipEntity

  @OneToOne(() => WorkRepresentativeEntity, work => work.representative, { cascade: true })
  work: WorkRepresentativeEntity;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamp'})
  updatedAt: Date;

  @DeleteDateColumn({ name: 'eliminado_en', type: 'timestamp'})
  deletedAt?: Date;

}
