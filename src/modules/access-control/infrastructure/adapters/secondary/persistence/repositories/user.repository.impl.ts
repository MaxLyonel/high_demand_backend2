// nestjs
import { Injectable } from "@nestjs/common";
// external dependencies
import { In, Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
// own implementations
import { UserRepository } from "@access-control/application/ports/outbound/user.repository";
import { UserEntity } from "../entities/user.entity";
import { User } from "@access-control/domain/models/user.model"
import { Teacher } from "@access-control/domain/models/teacher.model";
import { TeacherEntity } from "../entities/teacher.entity";


@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity, 'alta_demanda')
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TeacherEntity, 'alta_demanda')
    private readonly teacherRepository: Repository<TeacherEntity>
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { username }, relations: ['roles']})
    if(!userEntity) return null;
    return UserEntity.toDomain(userEntity)
  }

  async getTeacherInfo(personId: number, gestionId: number): Promise<Teacher | null> {
    const teacherEntity = await this.teacherRepository.findOne({
      where: {
        personId: personId,
        gestionId: gestionId,
        positionTypeId: In([1, 12])
      }
    })
    console.log("TeacherEntity --> ", teacherEntity)
    if(!teacherEntity) return null
    return TeacherEntity.toDomain(teacherEntity)
  }

  async findById(id: number): Promise<User | null> {
    const userEntity = await this.userRepository.findOne( { where: { id }, relations: ['roles']})
    if(!userEntity) return null;
    return UserEntity.toDomain(userEntity)
  }

}