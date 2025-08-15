import { Workflow as WorkflowModel } from "@high-demand/domain/models/workflow.model";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, W } from "typeorm";
import { WorkflowSequenceEntity } from "./workflow-sequence.entity";

@Entity({ schema: 'alta_demanda', name: 'flujo'})
export class WorkflowEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'nombre'})
  name: string

  @Column({ name: 'activo'})
  active: boolean

  @OneToMany(() => WorkflowSequenceEntity, sequence => sequence.workflow)
  sequences: WorkflowSequenceEntity[]

  static toDomain(entity: WorkflowEntity): WorkflowModel {
    return new WorkflowModel(
      entity.id,
      entity.name,
      entity.active
    )
  }
}