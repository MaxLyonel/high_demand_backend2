// external dependencies
import { Column, Entity, PrimaryColumn } from "typeorm";
// own implementations
import { User as UserModel } from '@access-control/domain/models/user.model';

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

  static toDomain(entity: UserEntity): UserModel {
    return UserModel.create({
      id: entity.id,
      username: entity.username,
      password: entity.password,
      personId: entity.personId,
      isActive: entity.isActive
    });
  }

  static fromDomain(user: UserModel): UserEntity {
    const entity = new UserEntity()
    entity.id = user.id,
    entity.username = user.username,
    entity.password = user.password,
    entity.personId = user.personId,
    entity.isActive = user.isActive
    return entity;
  }
}
