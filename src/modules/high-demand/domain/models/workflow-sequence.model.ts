



export class WorkflowSequence {
  constructor(
    public readonly id: number,
    public readonly workflowId: number,
    public readonly originState: number,
    public readonly destinyState: number,
    public readonly action: string,
    public readonly rolId: number
  ) {}

  static create({
    id,
    workflowId,
    originState,
    destinyState,
    action,
    rolId
  }: {
    id: number,
    workflowId: number,
    originState: number,
    destinyState: number,
    action: string,
    rolId: number
  }): WorkflowSequence {
    return new WorkflowSequence(id, workflowId, originState, destinyState, action, rolId)
  }
}