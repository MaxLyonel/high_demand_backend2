

export class Workflow {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly active: boolean
  ) {}


  static create({
    id,
    name,
    active
  }: {
    id: number,
    name: string,
    active: boolean
  }): Workflow {
    return new Workflow(id, name, active)
  }
}