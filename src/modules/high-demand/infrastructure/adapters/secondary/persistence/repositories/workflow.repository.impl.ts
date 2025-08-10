import { Workflow } from "@high-demand/domain/models/workflow.model";
import { WorkflowRepository } from "@high-demand/domain/ports/outbound/workflow.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkflowEntity } from "../entities/workflow.entity";
import { Equal, Repository } from "typeorm";



@Injectable()
export class WorkflowRepositoryImpl implements WorkflowRepository {

  constructor(
    @InjectRepository(WorkflowEntity, 'alta_demanda')
    private readonly workflowRepository: Repository<WorkflowEntity>
  ){}

  async findLastActive(): Promise<Workflow | null> {
    const workflowEntity = await this.workflowRepository.findOne({
      where: {
        active: true
      }
    })
    if(!workflowEntity) return null
    return WorkflowEntity.toDomain(workflowEntity)
  }
}