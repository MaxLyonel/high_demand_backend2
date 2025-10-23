// src/activity-log/activity-log.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'alta_demanda', name: 'activity_log'})
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number; // ID del log

  @Column({ name: 'user_id', nullable: true })
  userId: number; // ID del usuario que hizo la acción

  @Column()
  entity: string; // Nombre de la entidad afectada

  @Column({ name: 'entity_id', nullable: true })
  entityId: number; // ID de la entidad afectada (opcional)

  @Column()
  action: string; // Acción realizada: insert, update, remove, login, etc.

  @Column({ type: 'json', nullable: true })
  details: any; // Información adicional (JSON)

  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date; // Fecha de creación automática

  @UpdateDateColumn({ name: 'updated_at'})
  updatedAt: Date;
}
