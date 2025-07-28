


export class EducationalInstitution {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly state: number,
    public readonly personId: number
  ) {}

  static create({
    id,
    name,
    state,
    personId
  }: {
    id: number,
    name: string,
    state: number,
    personId: number
  }): EducationalInstitution {
    return new EducationalInstitution(id, name, state, personId)
  }
}