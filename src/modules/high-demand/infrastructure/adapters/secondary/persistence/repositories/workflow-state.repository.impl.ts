import { WorkflowState } from "@high-demand/domain/models/workflow-state.model";
import { WorkflowStateRepository } from "@high-demand/domain/ports/outbound/workflow-state.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkflowStateEntity } from "../entities/workflow-state.entity";
import { Repository } from "typeorm";



@Injectable()
export class WorkflowStateRepositoryImpl implements WorkflowStateRepository {

  constructor(
    @InjectRepository(WorkflowStateEntity, 'alta_demanda')
    private readonly workflowStateRepository: Repository<WorkflowStateEntity>
  ){}

  async findByName(name: string): Promise<WorkflowState> {
    const workflowStateEntity = await this.workflowStateRepository.findOne({
      where: {
        name: name
      }
    })
    return WorkflowStateEntity.toDomain(workflowStateEntity!)
  }
}