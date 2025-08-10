import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ActionEntity } from "./action.entity";
import { ResourceEntity } from "./resource.entity";
import { ConditionEntity } from "./condition.entity";
import { RolPermissionEntity } from "./rol-permission.entity";

@Entity({ schema: 'alta_demanda', name: 'permisos'})
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ActionEntity, { eager: true })
  @JoinColumn({ name: 'accion_id' })
  action: ActionEntity;

  @ManyToOne(() => ResourceEntity, { eager: true })
  @JoinColumn({ name: 'recurso_id' })
  resource: ResourceEntity;

  @Column({ default: true, name: 'activo' })
  active: boolean;

  @Column({ nullable: true, name: 'descripcion' })
  description: string;

  @OneToMany(() => RolPermissionEntity, (rolPermiso) => rolPermiso.permission)
  rolPermissions: RolPermissionEntity[];

  @OneToMany(() => ConditionEntity, (condicion) => condicion.permission, { eager: true })
  condition: ConditionEntity[];

  @Column({ name: 'creado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'actualizado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @Column({ name: 'eliminado_en', type: 'timestamp' })
  deletedAt: Date | null

}