import { Operative } from "src/modules/operations-programming/domain/operative.model";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity({ schema: 'alta_demanda', name: 'operativo'})
export class OperativeEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'fecha_pos_ue_ini'})
  datePosUEIni: Date

  @Column({ name: 'fecha_pos_ue_fin'})
  datePosUEEnd: Date

  @Column({ name: 'fecha_rev_dis_ini'})
  dateRevDisIni: Date

  @Column({ name: 'fecha_rev_dis_fin'})
  dateRevDisFin: Date

  @Column({ name: 'fecha_rev_dep_ini'})
  dateRevDepIni: Date

  @Column({ name: 'fecha_rev_dep_fin'})
  dateRevDepFin: Date

  @Column({ name: 'fecha_ope_ini'})
  dateOpeIni: Date

  @Column({ name: 'fecha_ope_fin'})
  dateOpeFin: Date

  @Column({ name: 'fecha_sorteo'})
  dateLottery: Date

  @Column({ name: 'gestion_id'})
  gestionId: number



  static create({
    id,
    datePosUEIni,
    datePosUEEnd,
    dateRevDisIni,
    dateRevDisEnd,
    dateRevDepIni,
    dateRevDepEnd,
    dateOpeIni,
    dateOpeFin,
    dateLottery,
    gestionId
  }: {
    id: number,
    datePosUEIni: Date,
    datePosUEEnd: Date,
    dateRevDisIni: Date,
    dateRevDisEnd: Date,
    dateRevDepIni: Date,
    dateRevDepEnd: Date,
    dateOpeIni: Date,
    dateOpeFin: Date,
    dateLottery: Date,
    gestionId: number
  }): Operative {
    return new Operative(
    id,
    datePosUEIni,
    datePosUEEnd,
    dateRevDisIni,
    dateRevDisEnd,
    dateRevDepIni,
    dateRevDepEnd,
    dateOpeIni,
    dateOpeFin,
    dateLottery,
    gestionId
    )
  }
}