import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "src/modules/access-control/application/ports/outbound/user.repository";
import { UserEntity } from "../entities/user.entity";
import { Repository } from 'typeorm';
import { User } from 'src/modules/access-control/domain/models/user.model';
import { Injectable } from "@nestjs/common";



@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity, 'alta_demanda')
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { username }})
    if(!userEntity) return null;
    return UserEntity.toDomain(userEntity)
  }

  async findById(id: number): Promise<User | null> {
    const userEntity = await this.userRepository.findOne( { where: { id }})
    if(!userEntity) return null;
    return UserEntity.toDomain(userEntity)
  }

}