import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { HighDemandRegistrationEntity } from "./high-demand.entity";
import { WorkflowStateEntity } from "./workflow-state.entity";
import { UserEntity } from "@access-control/infrastructure/adapters/secondary/persistence/entities/user.entity";
import { History } from "@high-demand/domain/models/history.model";

@Entity({ schema: 'alta_demanda', name: 'historial'})
export class HistoryEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'estado_inscripcion' })
  registrationStatus: RegistrationStatus

  @Column({ name: 'inscripcion_alta_demanda_id'})
  highDemandRegistrationId: number

  @Column({ name: 'flujo_estado_id'})
  workflowStateId: number

  @Column({ name: 'user_id'})
  userId: number

  @Column({ name: 'observacion'})
  observation: string

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => HighDemandRegistrationEntity, (reg) => reg.histories)
  @JoinColumn({ name: 'inscripcion_alta_demanda_id'})
  highDemandRegistration: HighDemandRegistrationEntity

  @ManyToOne(() => WorkflowStateEntity)
  @JoinColumn({ name: 'flujo_estado_id'})
  workflowState: WorkflowStateEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id'})
  user: UserEntity

  static toDomain(entity: any): History {
    return new History(
      entity.id,
      entity.highDemandRegistrationId,
      entity.educationalInstitutionId,
      entity.educationalInstitutionName,
      entity.userName,
      entity.workflowState,
      entity.registrationStatus,
      entity.observation
    )
  }

}