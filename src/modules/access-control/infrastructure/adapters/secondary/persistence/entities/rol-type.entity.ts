import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { PermissionEntity } from "./permission.entity";
import { Rol } from "@access-control/domain/models/rol.model";




@Entity({ name: 'rol_tipo'})
export class RolTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'rol'})
  name: string;

  // @Column({ name: 'lugar_nivel_tipo_id'})
  // placeLevelTypeId: number;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles, { eager: true })
  @JoinTable({
    name: 'rol_permisos',
    schema: 'alta_demanda',
    joinColumn: { name: 'rol_id', referencedColumnName: 'id'},
    inverseJoinColumn: { name: 'permiso_id', referencedColumnName: 'id'}
  })
  permissions: PermissionEntity[];

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];

  static toDomain(entity: RolTypeEntity): Rol {
    return Rol.create({
      id: entity.id,
      name: entity.name,
      permissions: entity.permissions?.map(p => PermissionEntity.toDomain(p)) || []
    })
  }

  static fromDomain(model: Rol): RolTypeEntity {
    const entity = new RolTypeEntity()
    entity.id = model.id
    entity.name = model.name
    entity.permissions = model.permissions?.map(p => PermissionEntity.fromDomain(p)) || [];
    return entity;
  }

}