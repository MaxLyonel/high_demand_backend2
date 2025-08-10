import { WorkflowState as WorkflowStateModel } from "@high-demand/domain/models/workflow-state.model";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ schema: 'alta_demanda', name: 'flujo_estado'})
export class WorkflowStateEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'nombre'})
  name: string


  static toDomain(entity: WorkflowStateEntity): WorkflowStateModel {
    return new WorkflowStateModel(
      entity.id,
      entity.name
    )
  }
}