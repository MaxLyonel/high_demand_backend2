import { WorkflowSequence } from "@high-demand/domain/models/workflow-sequence.model";



export abstract class WorkflowSequenceRepository {
  abstract findNextState(rolId: number, previousStateId: number): Promise<WorkflowSequence>;
}