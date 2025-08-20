

export class Criteria {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly active: boolean
  ){}

  static create({
    id,
    name,
    description,
    active
  }: {
    id: number,
    name: string,
    description: string,
    active: boolean
  }): Criteria {
    return new Criteria(id, name, description, active)
  }
}