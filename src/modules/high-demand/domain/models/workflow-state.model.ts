

export class WorkflowState {
  constructor(
    public readonly id: number,
    public readonly name: string
  ) {}

  static create({
    id,
    name,
  }: {
    id: number,
    name: string,
  }): WorkflowState {
    return new WorkflowState(id, name)
  }
}