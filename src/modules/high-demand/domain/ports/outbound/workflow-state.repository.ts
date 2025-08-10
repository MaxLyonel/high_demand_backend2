import { WorkflowState } from "@high-demand/domain/models/workflow-state.model";



export abstract class WorkflowStateRepository {
  abstract findByName(name: string): Promise<WorkflowState>;
}