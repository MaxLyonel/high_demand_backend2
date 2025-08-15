import { WorkflowSequence } from "@high-demand/domain/models/workflow-sequence.model";
import { WorkflowState } from "@high-demand/domain/models/workflow-state.model";



export abstract class WorkflowStateRepository {
  abstract findById(id: number): Promise<WorkflowState>;
  abstract findByName(name: string): Promise<WorkflowState>;
  abstract findNextState(rolId: number, stateId: number): Promise<WorkflowSequence>;
}