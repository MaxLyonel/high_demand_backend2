import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { PermissionEntity } from "./permission.entity";
import { RolTypeEntity } from "./rol-type.entity";

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
}