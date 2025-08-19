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

  // ** obtenemos la lista de secuencias ordenadas **
  async getOrderedFlowStates(): Promise<WorkflowSequence[]> {
    const workflowStates = await this.workflowSequenceRepository.find({
      order: {
        sequence: 'ASC'
      },
      relations: ['workflow', 'currentState', 'nextState']
    })
    const aux =  workflowStates.map(WorkflowSequenceEntity.toDomain)
    return aux
  }

  async findNextStates(rolId: number): Promise<WorkflowSequence[]> {
    const workflowSequenceEntity  = await this.workflowSequenceRepository.find({
      where: {
        currentState: { id: rolId }
      },
      relations: ['currentState', 'nextState', 'workflow']
    })
    return workflowSequenceEntity.map(WorkflowSequenceEntity.toDomain)
  }
}