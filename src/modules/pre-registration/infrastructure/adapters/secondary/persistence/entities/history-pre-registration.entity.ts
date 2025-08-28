import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PreRegistrationEntity } from "./pre-registration.entity";
import { UserEntity } from "@access-control/infrastructure/adapters/secondary/persistence/entities/user.entity";
import { RolTypeEntity } from "@access-control/infrastructure/adapters/secondary/persistence/entities/rol-type.entity";
import { PreRegistrationStatus } from "@pre-registration/domain/enums/pre-registration-status.enum";


@Entity({ schema: 'alta_demanda', name:'historial_pre_inscripcion'})
export class HistoryPreRegistrationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PreRegistrationEntity)
  @JoinColumn({ name: 'pre_inscripcion_id'})
  preRegistration: PreRegistrationEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id'})
  user: UserEntity;

  @ManyToOne(() => RolTypeEntity)
  @JoinColumn({ name: 'rol_id'})
  rol: RolTypeEntity;

  @Column({ name: 'estado', type: 'enum', enum: PreRegistrationStatus})
  state: PreRegistrationStatus

  @Column({ name:'observacion'})
  observation: string;

  @CreateDateColumn({name: 'creado_en', type: 'timestamp'})
  createdAt: Date;

  @UpdateDateColumn({ name:'actualizado_en', type: 'timestamp'})
  udpatedAt: Date;
}