import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolPermissionEntity } from "./rol-permission.entity";
import { UserEntity } from "./user.entity";




@Entity({ name: 'rol_tipo'})
export class RolTypeEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'rol'})
  name: string

  @OneToMany(() => RolPermissionEntity, (rolPermiso) => rolPermiso.rol)
  rolPermissions: RolPermissionEntity[];

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];

}