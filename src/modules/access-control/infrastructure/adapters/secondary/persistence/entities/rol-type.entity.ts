import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { PermissionEntity } from "./permission.entity";




@Entity({ name: 'rol_tipo'})
export class RolTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'rol'})
  name: string;

  @Column({ name: 'lugar_nivel_tipo_id'})
  placeLevelTypeId: number;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles, { eager: true })
  @JoinTable({
    name: 'rol_permisos',
    joinColumn: { name: 'rol_id', referencedColumnName: 'id'},
    inverseJoinColumn: { name: 'permiso_id', referencedColumnName: 'id'}
  })
  permissions: PermissionEntity[];

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];

}