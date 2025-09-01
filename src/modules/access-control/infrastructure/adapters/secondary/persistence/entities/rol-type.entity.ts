import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { PermissionEntity } from "./permission.entity";
import { Rol } from "@access-control/domain/models/rol.model";
import { UserRoleEntity } from "./user-rol.entity";




@Entity({ name: 'rol_tipo'})
export class RolTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'rol'})
  name: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles, { eager: true })
  @JoinTable({
    name: 'rol_permisos',
    schema: 'alta_demanda',
    joinColumn: { name: 'rol_id', referencedColumnName: 'id'},
    inverseJoinColumn: { name: 'permiso_id', referencedColumnName: 'id'}
  })
  permissions: PermissionEntity[];

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.role)
  userRoles: UserRoleEntity[];

  static toDomain(entity: RolTypeEntity): Rol {
    console.log("ingrsa aca")
    return Rol.create({
      id: entity.id,
      name: entity.name,
      permissions: entity.permissions?.map(p => PermissionEntity.toDomain(p)) || []
    });
  }

  static fromDomain(model: Rol): RolTypeEntity {
    const entity = new RolTypeEntity();
    entity.id = model.id;
    entity.name = model.name;
    entity.permissions = model.permissions?.map(p => PermissionEntity.fromDomain(p)) || [];
    return entity;
  }

}