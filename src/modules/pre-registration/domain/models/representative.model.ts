
export class Representative {
  constructor(
    public readonly id: number,
    public readonly identityCard: string,
    public readonly lastName: string,
    public readonly mothersLastName: string,
    public readonly name: string,
    public readonly cellPhone: string,
    public readonly relationshipTypeId: any
  ){}


  static create({
    id,
    identityCard,
    lastName,
    mothersLastName,
    name,
    cellPhone,
    relationshipTypeId
  }: {
    id: number,
    identityCard: string,
    lastName: string,
    mothersLastName: string,
    name: string,
    cellPhone: string,
    relationshipTypeId: any
  }): Representative {
    return new Representative(
      id,
      identityCard,
      lastName,
      mothersLastName,
      name,
      cellPhone,
      relationshipTypeId
    )
  }
}