import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PlaceTypeEntity } from "./place-type.entity";
import { PreRegistration } from "@pre-registration/domain/models/pre-registration.model";
import { LocationType } from "@pre-registration/domain/enums/location-type.enum";
import { PreRegistrationEntity } from "./pre-registration.entity";




@Entity({ schema: 'alta_demanda', name: 'pre_inscripcion_ubicacion'})
export class PreRegistrationLocationEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => PreRegistrationEntity, { eager: true })
  @JoinColumn({ name: 'pre_inscripcion_id'})
  preRegistration: PreRegistrationEntity

  @Column({ name: 'zona_avenida'})
  zoneVilla: string

  @Column({ name: 'avenida_calle_nro'})
  avenueStreetNro: string

  @Column({ name: 'telefono_celular'})
  telephone: string

  @Column({ name: 'nombre_trabajo_lugar'})
  nameWorkPlace: string

  @Column({
    name: 'tipo',
    type: 'enum',
    enum: LocationType
  })
  type: LocationType

  @ManyToOne(() => PlaceTypeEntity)
  @JoinColumn({ name: 'municipio_id'})
  municipality: PlaceTypeEntity

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamp'})
  updatedAt: Date;

  @DeleteDateColumn({ name: 'eliminado_en', type: 'timestamp'})
  deletedAt?: Date;
}