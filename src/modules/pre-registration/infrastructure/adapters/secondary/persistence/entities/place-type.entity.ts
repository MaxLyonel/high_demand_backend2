import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";


@Entity({ name: 'lugar_tipo'})
export class PlaceTypeEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'lugar'})
  place: string

  @Column({ name: 'lugar_tipo_id', nullable: true })
  parentId: number | null

  @ManyToOne(() => PlaceTypeEntity, parent => parent.children, { nullable: true })
  @JoinColumn({ name: 'lugar_tipo_id'})
  parent: PlaceTypeEntity

  @OneToMany(() => PlaceTypeEntity, child => child.parent)
  children: PlaceTypeEntity[];

  @Column({ name: 'lugar_nivel_id'})
  placeLevelId: number
}