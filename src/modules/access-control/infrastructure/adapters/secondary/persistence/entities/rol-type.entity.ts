import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PermissionEntity } from "./permission.entity";
import { Rol } from "@access-control/domain/models/rol.model";
import { UserRoleEntity } from "./user-rol.entity";
import { RolPermissionEntity } from "./rol-permission.entity";


@Entity({ name: 'rol_tipo'})
export class RolTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'rol'})
  name: string;

  @OneToMany(() => RolPermissionEntity, (rolPermission) => rolPermission.rol, { eager: true })
  rolPermissions: RolPermissionEntity[];

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.role)
  userRoles: UserRoleEntity[];

  static toDomain(entity: RolTypeEntity): Rol {
    return Rol.create({
      id: entity.id,
      name: entity.name,
      rolPermissions: entity.rolPermissions?.map(rp => RolPermissionEntity.toDomain(rp)) || []
    });
  }

  static fromDomain(model: Rol): RolTypeEntity {
    const entity = new RolTypeEntity();
    entity.id = model.id;
    entity.name = model.name;

    entity.rolPermissions = model.rolPermissions?.map(p => {
      const rp = new RolPermissionEntity()
      rp.permission = PermissionEntity.fromDomain(rp.permission)
      return rp
    }) || []

    return entity;
  }

}