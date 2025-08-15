import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { WorkflowEntity } from "./workflow.entity";
import { WorkflowStateEntity } from "./workflow-state.entity";
import { RolTypeEntity } from "@access-control/infrastructure/adapters/secondary/persistence/entities/rol-type.entity";
import { WorkflowSequence } from "@high-demand/domain/models/workflow-sequence.model";



@Entity({ schema: 'alta_demanda', name: 'flujo_secuencia'})
export class WorkflowSequenceEntity {
  @PrimaryColumn()
  id: number

  @ManyToOne(() => WorkflowEntity, workflow => workflow.sequences, { nullable: false })
  @JoinColumn({ name: 'flujo_id'})
  workflow: WorkflowEntity

  @ManyToOne(() => WorkflowStateEntity, { nullable: false })
  @JoinColumn({ name: 'estado_origen'})
  stateOrigin: WorkflowStateEntity

  @ManyToOne(() => WorkflowStateEntity, { nullable: false })
  @JoinColumn({ name: 'estado_destino'})
  stateDestiny: WorkflowStateEntity

  @Column({ type: 'varchar', length: 50, name: 'accion'})
  action: string

  @ManyToOne(() => RolTypeEntity, { nullable: false })
  @JoinColumn({ name: 'rol_id'})
  rol?: RolTypeEntity

  static toDomain(entity: WorkflowSequenceEntity): WorkflowSequence {
    return WorkflowSequence.create({
      id: entity.id,
      workflowId: entity.id,
      originState: entity.stateOrigin.id,
      destinyState: entity.stateDestiny.id,
      action: entity.action,
      rolId: entity.rol!.id
    })
  }

  static fromDomain(domain: WorkflowSequence): WorkflowSequenceEntity {
    const entity = new WorkflowSequenceEntity()
    entity.id = domain.id
    entity.workflow = new WorkflowEntity()
    entity.workflow.id = domain.workflowId

    entity.stateOrigin = new WorkflowStateEntity()
    entity.stateOrigin.id = domain.originState

    entity.action = domain.action
    if(domain.rolId) {
      entity.rol = new RolTypeEntity()
      entity.rol.id = domain.rolId
    }
    return entity;
  }
}