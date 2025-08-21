import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PostulantEntity } from "./postulant.entity";
import { PlaceTypeEntity } from "./place-type.entity";


@Entity({ schema: 'alta_demanda', name: 'postulante_residencia'})
export class PostulantResidence {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => PostulantEntity, { eager: false })
  @JoinColumn({ name: 'postulante_id'})
  postulant: PostulantEntity

  @ManyToOne(() => PlaceTypeEntity, { eager: false})
  @JoinColumn({ name: 'municipio_id'})
  municipality: PlaceTypeEntity

  @Column({ name: 'zona_villa'})
  area: string

  @Column({ name: 'avenida_calle_nro'})
  address: string

  @Column({ name: 'telefono'})
  telephone: string

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp'})
  createdAt: Date

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamp'})
  updatedAt: Date

  @DeleteDateColumn({ name: 'eliminado_en', type: 'timestamp'})
  deletedAt: Date


}