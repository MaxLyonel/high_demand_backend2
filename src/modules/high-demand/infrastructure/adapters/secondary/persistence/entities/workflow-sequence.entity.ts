import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { WorkflowEntity } from "./workflow.entity";
import { RolTypeEntity } from "@access-control/infrastructure/adapters/secondary/persistence/entities/rol-type.entity";
import { WorkflowSequence } from "@high-demand/domain/models/workflow-sequence.model";



@Entity({ schema: 'alta_demanda', name: 'flujo_secuencia'})
export class WorkflowSequenceEntity {
  @PrimaryColumn()
  id: number

  @ManyToOne(() => WorkflowEntity, workflow => workflow.sequences, { nullable: false })
  @JoinColumn({ name: 'flujo_id'})
  workflow: WorkflowEntity

  @Column({ type: 'varchar', length: 50, name: 'accion'})
  action: string

  @ManyToOne(() => RolTypeEntity)
  @JoinColumn({ name: 'estado_actual'})
  currentState: RolTypeEntity

  @ManyToOne(() => RolTypeEntity)
  @JoinColumn({ name: 'estado_siguiente'})
  nextState: RolTypeEntity

  @Column({ name: 'secuencia'})
  sequence: number

  static toDomain(entity: WorkflowSequenceEntity): WorkflowSequence {
    return WorkflowSequence.create({
      id: entity.id,
      workflowId: entity.workflow.id,
      currentState: entity.currentState.id,
      nextState: entity.nextState.id,
      action: entity.action,
    })
  }

  static fromDomain(domain: WorkflowSequence): WorkflowSequenceEntity {
    const entity = new WorkflowSequenceEntity()
    entity.id = domain.id
    entity.workflow = new WorkflowEntity()
    entity.workflow.id = domain.workflowId
    entity.currentState = new RolTypeEntity()
    entity.currentState.id = domain.currentState
    entity.action = domain.action
    return entity;
  }
}