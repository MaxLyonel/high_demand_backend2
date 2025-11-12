import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RelationshipEntity } from "./relationship.entity";
import { WorkRepresentativeEntity } from "./work-representative.entity";
import { Representative } from "@pre-registration/domain/models/representative.model";


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

  @Column({ name: 'celular'})
  cellphone: string

  @Column({ name: 'direccion'})
  address: string

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

  static toDomain(entity: RepresentativeEntity): Representative {
    return new Representative (
      entity.id,
      entity.identityCard,
      entity.complement,
      entity.lastName,
      entity.mothersLastName,
      entity.name,
      entity.dateBirth,
      entity.nationality,
    )
  }
}
