import { Workflow } from '@high-demand/domain/models/workflow.model';



export abstract class WorkflowRepository {
  abstract findLastActive(): Promise<Workflow | null>;
}