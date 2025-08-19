



export class WorkflowSequence {
  constructor(
    public readonly id: number,
    public readonly workflowId: number,
    public readonly currentState: number,
    public readonly nextState: number,
    public readonly action: string,
  ) {}

  static create({
    id,
    workflowId,
    currentState,
    nextState,
    action,
  }: {
    id: number,
    workflowId: number,
    currentState: number,
    nextState: number,
    action: string,
  }): WorkflowSequence {
    return new WorkflowSequence(id, workflowId, currentState, nextState, action)
  }
}