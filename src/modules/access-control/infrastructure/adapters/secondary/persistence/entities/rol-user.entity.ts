import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { RolTypeEntity } from "./rol-type.entity";

@Entity({ name: 'usuario_rol' })
export class RolUsuarioEntity {
  @PrimaryColumn({ name: 'usuario_id' })
  usuarioId: number;

  @PrimaryColumn({ name: 'rol_id' })
  rolId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'usuario_id' })
  usuario: UserEntity;

  @ManyToOne(() => RolTypeEntity)
  @JoinColumn({ name: 'rol_tipo_id' })
  rol: RolTypeEntity;
}
