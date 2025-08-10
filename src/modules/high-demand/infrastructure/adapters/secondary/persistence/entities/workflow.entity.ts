import { Workflow as WorkflowModel } from "@high-demand/domain/models/workflow.model";
import { Column, Entity, PrimaryGeneratedColumn, W } from "typeorm";

@Entity({ schema: 'alta_demanda', name: 'flujo'})
export class WorkflowEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'nombre'})
  name: string

  @Column({ name: 'activo'})
  active: boolean

  static toDomain(entity: WorkflowEntity): WorkflowModel {
    return new WorkflowModel(
      entity.id,
      entity.name,
      entity.active
    )
  }
}