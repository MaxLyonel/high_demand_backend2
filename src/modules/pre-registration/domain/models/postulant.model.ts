

export class Postulant {
  constructor(
    public readonly id: number,
    public readonly identityCard: string,
    public readonly lastName: string,
    public readonly mothersLastName: string,
    public readonly name: string,
    public readonly dateBirth: Date,
    public readonly placeBirh: string,
    public readonly genere: string,
    public readonly codeRude?: string
  ) {}

  static create({
    id,
    identityCard,
    lastName,
    mothersLastName,
    name,
    dateBirth,
    placeBirth,
    genere,
    codeRude
  }: {
    id: number,
    identityCard: string,
    lastName: string,
    mothersLastName: string,
    name: string,
    dateBirth: Date,
    placeBirth: string,
    genere: string,
    codeRude: string
  }): Postulant {

    if(!identityCard || identityCard.trim() === '') {
      throw new Error('El CI es obligatorio')
    }

    return new Postulant(
      id,
      identityCard,
      lastName,
      mothersLastName,
      name,
      dateBirth,
      placeBirth,
      genere,
      codeRude
    )
  }
}