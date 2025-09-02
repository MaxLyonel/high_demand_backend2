// import { Operative } from "src/modules/operations-programming/domain/operative.model";
import { Operative } from "../../../../../domain/models/operative.model"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity({ schema: 'alta_demanda', name: 'operativo'})
export class OperativeEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'fec_pos_ue_ini'})
  datePosUEIni: Date

  @Column({ name: 'fec_pos_ue_fin'})
  datePosUEEnd: Date

  @Column({ name: 'fec_rev_dis_ini'})
  dateRevDisIni: Date

  @Column({ name: 'fec_rev_dis_fin'})
  dateRevDisEnd: Date

  @Column({ name: 'fec_rev_dep_ini'})
  dateRevDepIni: Date

  @Column({ name: 'fec_rev_dep_fin'})
  dateRevDepEnd: Date

  @Column({ name: 'fec_ope_ini'})
  dateOpeIni: Date

  @Column({ name: 'fec_ope_fin'})
  dateOpeEnd: Date

  @Column({ name: 'fecha_sorteo'})
  dateLottery: Date

  @Column({ name: 'gestion_id'})
  gestionId: number


  static toDomain(entity: OperativeEntity): Operative {
    return new Operative(
      entity.id,
      entity.datePosUEIni,
      entity.datePosUEEnd,
      entity.dateRevDisIni,
      entity.dateRevDisEnd,
      entity.dateRevDepIni,
      entity.dateRevDepEnd,
      entity.dateOpeIni,
      entity.dateOpeEnd,
      entity.dateLottery,
      entity.gestionId
    )
  }

}