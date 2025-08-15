import { WorkflowSequence } from "@high-demand/domain/models/workflow-sequence.model";



export abstract class WorkflowSequenceService {
  abstract getNextState(rolId: number, previousStateId: number): Promise<WorkflowSequence>;
}