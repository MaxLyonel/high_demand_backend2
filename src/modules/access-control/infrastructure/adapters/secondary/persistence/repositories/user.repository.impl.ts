// nestjs
import { Injectable } from "@nestjs/common";
// external dependencies
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
// own implementations
import { UserRepository } from "@access-control/application/ports/outbound/user.repository";
import { UserEntity } from "../entities/user.entity";
import { User } from "@access-control/domain/models/user.model"


@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity, 'alta_demanda')
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { username }, relations: ['roles']})
    if(!userEntity) return null;
    return UserEntity.toDomain(userEntity)
  }

  async findById(id: number): Promise<User | null> {
    const userEntity = await this.userRepository.findOne( { where: { id }, relations: ['roles']})
    if(!userEntity) return null;
    return UserEntity.toDomain(userEntity)
  }

}