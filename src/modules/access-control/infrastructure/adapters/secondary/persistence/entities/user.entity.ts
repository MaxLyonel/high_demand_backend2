// external dependencies
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
// own implementations
import { User as UserModel } from '@access-control/domain/models/user.model';
import { RolTypeEntity } from "./rol-type.entity";
import { Rol } from "@access-control/domain/models/rol.model";
import { UserRoleEntity } from "./user-rol.entity";

@Entity({name: 'usuario'})
export class UserEntity {
  @PrimaryColumn()
  id: number

  @Column()
  username: string

  @Column()
  password: string

  @Column({name: 'persona_id'})
  personId: number

  @Column({name: 'esactivo'})
  isActive: boolean

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user, { eager: true })
  userRoles: UserRoleEntity[];

  static toDomain(entity: UserEntity): UserModel {
    return UserModel.create({
      id: entity.id,
      username: entity.username,
      password: entity.password,
      personId: entity.personId,
      isActive: entity.isActive,
      roles: entity.userRoles
        .filter(ur => ur.active) // 👈 solo roles activos
        .map(ur => UserRoleEntity.toDomain(ur))
    });
  }

  static fromDomain(user: UserModel): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.username = user.username;
    entity.password = user.password;
    entity.personId = user.personId;
    entity.isActive = user.isActive;

    entity.userRoles = user.roles?.map(rolDomain =>
      UserRoleEntity.fromDomain(rolDomain, entity)
    ) || [];

    return entity;
  }

}
