import { WorkflowState } from "@high-demand/domain/models/workflow-state.model";
import { WorkflowStateRepository } from "@high-demand/domain/ports/outbound/workflow-state.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WorkflowStateEntity } from "../entities/workflow-state.entity";
import { Repository } from "typeorm";
import { WorkflowSequenceEntity } from "../entities/workflow-sequence.entity";
import { WorkflowSequence } from "@high-demand/domain/models/workflow-sequence.model";



@Injectable()
export class WorkflowStateRepositoryImpl implements WorkflowStateRepository {

  constructor(
    @InjectRepository(WorkflowStateEntity, 'alta_demanda')
    private readonly workflowStateRepository: Repository<WorkflowStateEntity>,
    @InjectRepository(WorkflowSequenceEntity, 'alta_demanda')
    private readonly workflowSequenceRepository: Repository<WorkflowSequenceEntity>
  ){}

  async findById(id: number): Promise<WorkflowState> {
    const workflowStateEntity = await this.workflowStateRepository.findOne({
      where: {
        id: id
      }
    })
    if(!workflowStateEntity) throw new Error("Error al obtener el flujo estado por id")
    return WorkflowStateEntity.toDomain(workflowStateEntity)
  }

  async findByName(name: string): Promise<WorkflowState> {
    const workflowStateEntity = await this.workflowStateRepository.findOne({
      where: {
        name: name
      }
    })
    return WorkflowStateEntity.toDomain(workflowStateEntity!)
  }

  async findNextState(rolId: number, previousStateId: number): Promise<WorkflowSequence> {
    const workflowSequenceEntity = await this.workflowSequenceRepository.findOne({
      where: {
        currentState: { id: previousStateId }
      },
      relations:  ['rol', 'stateOrigin', 'stateDestiny', 'workflow']
    })
    return WorkflowSequenceEntity.toDomain(workflowSequenceEntity!)
  }
}