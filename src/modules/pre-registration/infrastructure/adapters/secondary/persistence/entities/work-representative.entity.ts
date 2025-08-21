import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RepresentativeEntity } from "./representative.entity";

@Entity({ name: 'trabajo_apoderado', schema: 'alta_demanda' })
export class WorkRepresentativeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RepresentativeEntity, rep => rep.work)
  @JoinColumn({ name: 'apoderado_id' })
  representative: RepresentativeEntity;

  @Column({ name: 'municipio_id', nullable: true })
  municipalityId: number;

  @Column({ name: 'area', nullable: true })
  area: string;

  @Column({ name: 'nombre_lugar_trabajo', nullable: true })
  workPlaceName: string;

  @Column({ name: 'direccion', nullable: true })
  address: string;

  @Column({ name: 'telefono', nullable: true })
  phone: string;
}
