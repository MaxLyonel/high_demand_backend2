import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkflowSequenceEntity } from '../entities/workflow-sequence.entity';
import { Repository } from "typeorm";
import { WorkflowSequenceRepository } from "@high-demand/domain/ports/outbound/workflow-sequence.repository";
import { WorkflowSequence } from "@high-demand/domain/models/workflow-sequence.model";



@Injectable()
export class WorkflowSequenceRepositoryImpl implements WorkflowSequenceRepository {
  constructor(
    @InjectRepository(WorkflowSequenceEntity, 'alta_demanda')
    private readonly workflowSequenceRepository: Repository<WorkflowSequenceEntity>
  ){}

  async findNextState(rolId: number, previousStateId: number): Promise<WorkflowSequence> {
    const workflowSequenceEntity  = await this.workflowSequenceRepository.findOne({
      where: {
        rol: { id: rolId },
        stateOrigin: { id: previousStateId }
      },
      relations: ['rol', 'stateOrigin', 'stateDestiny', 'workflow']
    })
    return WorkflowSequenceEntity.toDomain(workflowSequenceEntity!)
  }



}