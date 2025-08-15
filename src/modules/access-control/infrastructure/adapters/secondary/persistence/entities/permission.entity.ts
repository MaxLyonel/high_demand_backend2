import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ActionEntity } from "./action.entity";
import { ResourceEntity } from "./resource.entity";
import { ConditionEntity, OperatorEnum } from "./condition.entity";
import { RolPermissionEntity } from "./rol-permission.entity";
import { Permission } from "@access-control/domain/models/permission.model";
import { RolTypeEntity } from "./rol-type.entity";

@Entity({ schema: 'alta_demanda', name: 'permisos'})
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ActionEntity, { eager: true })
  @JoinColumn({ name: 'accion_id' })
  action: ActionEntity;

  @ManyToOne(() => ResourceEntity, { eager: true })
  @JoinColumn({ name: 'recurso_id' })
  subject: ResourceEntity;

  @Column({ default: true, name: 'activo' })
  active: boolean;

  @Column({ nullable: true, name: 'descripcion' })
  description: string;

  @ManyToMany(() => RolTypeEntity, (rol) => rol.permissions)
  roles: RolTypeEntity[];

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

  static toDomain(entity: PermissionEntity): Permission {
    return Permission.create({
      action: { id: entity.action.id, name: entity.action.name },
      subject: { id: entity.subject.id, name: entity.subject.name },
      conditions: entity.condition?.map(c => ({
        field: c.field,
        operator: c.operator,
        value: c.value
      })) || []
    })
  }

  static fromDomain(model: Permission): PermissionEntity {
    const entity = new PermissionEntity()

    entity.action = { id: model.action.id, name: model.action.name } as ActionEntity
    entity.subject = { id: model.subject.id, name: model.subject.name } as ResourceEntity
    entity.condition = model.conditions?.map(c => {
      const condEntity = new ConditionEntity();
      condEntity.field = c.field,
      condEntity.operator = OperatorEnum[c.operator as keyof typeof OperatorEnum]
      condEntity.value = Array.isArray(c.value)
        ? JSON.stringify(c.value)
        : String(c.value)
      return condEntity
    }) || []
    return entity
  }

}