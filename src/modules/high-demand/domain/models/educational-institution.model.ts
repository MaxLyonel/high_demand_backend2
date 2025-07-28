


export class EducationalInstitution {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly state: number
  ) {}

  static create({
    id,
    name,
    state,
  }: {
    id: number,
    name: string,
    state: number,
  }): EducationalInstitution {
    return new EducationalInstitution(id, name, state )
  }
}