import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PreRegistrationEntity } from "./pre-registration.entity";



@Entity({ schema: 'alta_demanda', name: 'pre_inscripcion_hermano'})
export class PreRegistrationBrotherEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'codigo_rude'})
  codeRude: string

  @ManyToOne(() => PreRegistrationEntity, { eager: true })
  @JoinColumn({ name: 'pre_inscripcion_id'})
  preRegistration: PreRegistrationEntity

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamp'})
  updatedAt: Date;

  @DeleteDateColumn({ name: 'eliminado_en', type: 'timestamp'})
  deletedAt?: Date
}