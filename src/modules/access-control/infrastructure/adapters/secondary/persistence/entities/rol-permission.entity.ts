import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { PermissionEntity } from "./permission.entity";
import { RolTypeEntity } from "./rol-type.entity";
import { RolPermission } from "@access-control/domain/models/rol-permission.model";

@Entity({ schema: 'alta_demanda', name: 'rol_permisos' })
export class RolPermissionEntity {
  @PrimaryColumn({ name: 'rol_id'})
  rolId: number

  @PrimaryColumn({ name: 'permiso_id'})
  permissionId: number

  @ManyToOne(() => RolTypeEntity, (rol) => rol.rolPermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rol_id' })
  rol: RolTypeEntity;

  @ManyToOne(() => PermissionEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permiso_id' })
  permission: PermissionEntity

  @Column({ default: true, name: 'activo' })
  active: boolean;

  @Column({ nullable: true, name: 'creado_por' })
  createBy: number;

  @Column({ name: 'creado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  static toDomain(entity: RolPermissionEntity): RolPermission {
    const res =  RolPermission.create({
      permission: PermissionEntity.toDomain(entity.permission),
      active: entity.active,
      createdBy: entity.createBy,
      createdAt: entity.createAt
    });
    // console.log(JSON.stringify(res, null, 2));
    return res
  }

  static fromDomain(rolPermission: RolPermission): RolPermissionEntity {
    const entity = new RolPermissionEntity()
    entity.permission = PermissionEntity.fromDomain(entity.permission)
    entity.active = rolPermission.active
    return entity
  }
}