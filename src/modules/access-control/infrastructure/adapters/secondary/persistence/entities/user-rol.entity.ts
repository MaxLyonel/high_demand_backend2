import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Column } from "typeorm";
import { UserEntity } from "./user.entity";
import { RolTypeEntity } from "./rol-type.entity";
import { Rol } from "@access-control/domain/models/rol.model";
import { RolPermissionEntity } from "./rol-permission.entity";
import { PlaceTypeEntity } from "@pre-registration/infrastructure/adapters/secondary/persistence/entities/place-type.entity";
import { UserRole } from "@access-control/domain/models/user-role.model";

@Entity({ name: 'usuario_rol' })
export class UserRoleEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: "esactivo"})
  active: boolean

  @ManyToOne(() => PlaceTypeEntity)
  @JoinColumn({ name: 'lugar_tipo_id'})
  placeType: PlaceTypeEntity

  @ManyToOne(() => UserEntity, (user) => user.userRoles, { onDelete: "CASCADE" })
  @JoinColumn({ name: "usuario_id" })
  user: UserEntity;

  @ManyToOne(() => RolTypeEntity, (rol) => rol.userRoles, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "rol_tipo_id" })
  role: RolTypeEntity;

  // static toDomain(entity: UserRoleEntity): Rol {
  //   return Rol.create({
  //     id: entity.role.id,
  //     name: entity.role.name,
  //     rolPermissions: entity.role.rolPermissions?.map(rp => RolPermissionEntity.toDomain(rp))
  //   });
  // }
  static toDomain(entity: UserRoleEntity): UserRole {
    return UserRole.create({
      id: entity.id,
      active: entity.active,
      role: Rol.create({
        id: entity.role.id,
        name: entity.role.name,
        rolPermissions: entity.role.rolPermissions?.map((rp) =>
          RolPermissionEntity.toDomain(rp)
        )
      }),
      placeType: entity.placeType
        ? {
          id: entity.placeType.id,
          name: entity.placeType.place,
          parent: entity.placeType.parent
            ? {
              id: entity.placeType.parent.id,
              name: entity.placeType.parent.place
            }
            : undefined
        }
      : undefined
    })
  }

  static fromDomain(model: Rol, user: UserEntity): UserRoleEntity {
    const entity = new UserRoleEntity();
    entity.user = user;
    entity.role = RolTypeEntity.fromDomain(model);
    entity.active = true;
    return entity;
  }


}
