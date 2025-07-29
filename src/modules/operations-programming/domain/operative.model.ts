


export class Operative {
  constructor (
    public readonly id: number,
    public readonly datePosUEIni: Date,
    public readonly datePosUEEnd: Date,
    public readonly dateRevDisIni: Date,
    public readonly dateRevDisEnd: Date,
    public readonly dateRevDepIni: Date,
    public readonly dateRevDepEnd: Date,
    public readonly dateOpeIni: Date,
    public readonly dateOpeEnd: Date,
    public readonly dateLottery: Date,
    public readonly gestionId: number
  ) {}


  static create({
    id,
    datePosUEIni,
    datePosUEEnd,
    dateRevDisIni,
    dateRevDisEnd,
    dateRevDepIni,
    dateRevDepEnd,
    dateOpeIni,
    dateOpeEnd,
    dateLottery,
    gestionId
  }: {
    id: number
    datePosUEIni: Date,
    datePosUEEnd: Date,
    dateRevDisIni: Date,
    dateRevDisEnd: Date,
    dateRevDepIni: Date,
    dateRevDepEnd: Date,
    dateOpeIni: Date,
    dateOpeEnd: Date,
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
      dateOpeEnd,
      dateLottery,
      gestionId
    )
  }
}