
export class Representative {
  constructor(
    public readonly id: number,
    public readonly identityCard: string,
    public readonly complement: string,
    public readonly lastName: string,
    public readonly mothersLastName: string,
    public readonly name: string,
    public readonly dateBirth: Date,
    public readonly nationality: boolean,
  ){}


  static create({
    id,
    identityCard,
    complement,
    lastName,
    mothersLastName,
    name,
    dateBirth,
    nationality,
  }: {
    id: number,
    identityCard: string,
    complement: string,
    lastName: string,
    mothersLastName: string,
    name: string,
    dateBirth: Date,
    nationality: boolean,
  }): Representative {
    return new Representative(
      id,
      identityCard,
      complement,
      lastName,
      mothersLastName,
      name,
      dateBirth,
      nationality,
    )
  }
}