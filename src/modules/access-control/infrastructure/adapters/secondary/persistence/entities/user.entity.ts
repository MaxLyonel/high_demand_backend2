// external dependencies
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
// own implementations
import { User as UserModel } from '@access-control/domain/models/user.model';
import { RolTypeEntity } from "./rol-type.entity";
import { Rol } from "@access-control/domain/models/rol.model";

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

  @ManyToMany(() => RolTypeEntity, (rol) => rol.users, { eager: true }) // le dice a TypeOrm que la relación entre UserEntity y RolTypeEntity es de mucho a muchos
  @JoinTable({
    name: 'usuario_rol',
    joinColumn: { name: 'usuario_id', referencedColumnName: 'id' }, // que columnas componen
    inverseJoinColumn: { name: 'rol_tipo_id', referencedColumnName: 'id' },
  })
  roles: RolTypeEntity[];

  static toDomain(entity: UserEntity): UserModel {
    return UserModel.create({
      id: entity.id,
      username: entity.username,
      password: entity.password,
      personId: entity.personId,
      isActive: entity.isActive,
      roles: entity.roles.map(rolEntity => RolTypeEntity.toDomain(rolEntity))
    });
  }

  static fromDomain(user: UserModel): UserEntity {
    const entity = new UserEntity()
    entity.id = user.id;
    entity.username = user.username;
    entity.password = user.password;
    entity.personId = user.personId;
    entity.isActive = user.isActive;
    entity.roles ? user.roles.map(rolDomain => RolTypeEntity.fromDomain(rolDomain)) : [];
    return entity;
  }
}
