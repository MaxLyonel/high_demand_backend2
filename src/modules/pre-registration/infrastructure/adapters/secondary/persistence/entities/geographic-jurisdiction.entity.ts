import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { PlaceTypeEntity } from './place-type.entity';



@Entity({ name: 'jurisdiccion_geografica'})
export class GeographicJurisdictionEntity {
  @PrimaryColumn()
  id: number

  @ManyToOne(() => PlaceTypeEntity, { eager: false })
  @JoinColumn({ name: 'lugar_tipo_id_localidad'})
  localityPlaceType: PlaceTypeEntity

  @ManyToOne(() => PlaceTypeEntity, { eager: false })
  @JoinColumn({ name: 'lugar_tipo_id_distrito'})
  districtPlaceType: PlaceTypeEntity

  @Column({ name: 'direccion'})
  direction: string

  @Column({ name: 'zona'})
  area: string
}