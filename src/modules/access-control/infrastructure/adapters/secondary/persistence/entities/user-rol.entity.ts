import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Column } from "typeorm";
import { UserEntity } from "./user.entity";
import { RolTypeEntity } from "./rol-type.entity";
import { Rol } from "@access-control/domain/models/rol.model";
import { RolPermissionEntity } from "./rol-permission.entity";

@Entity({ name: 'usuario_rol' })
export class UserRoleEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: "esactivo"})
  active: boolean

  @ManyToOne(() => UserEntity, (user) => user.userRoles, { onDelete: "CASCADE" })
  @JoinColumn({ name: "usuario_id" })
  user: UserEntity;

  @ManyToOne(() => RolTypeEntity, (rol) => rol.userRoles, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "rol_tipo_id" })
  role: RolTypeEntity;

  static toDomain(entity: UserRoleEntity): Rol {
    return Rol.create({
      id: entity.role.id,
      name: entity.role.name,
      rolPermissions: entity.role.rolPermissions?.map(rp => RolPermissionEntity.toDomain(rp))
    });
  }

  static fromDomain(model: Rol, user: UserEntity): UserRoleEntity {
    const entity = new UserRoleEntity();
    entity.user = user;
    entity.role = RolTypeEntity.fromDomain(model);
    entity.active = true;
    return entity;
  }


}
