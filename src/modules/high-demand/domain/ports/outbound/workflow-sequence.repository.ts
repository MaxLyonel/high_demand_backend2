import { WorkflowSequence } from "@high-demand/domain/models/workflow-sequence.model";



export abstract class WorkflowSequenceRepository {
  abstract getOrderedFlowStates(): Promise<WorkflowSequence[]>;
  abstract findNextStates(rolId: number): Promise<WorkflowSequence[]>;
}