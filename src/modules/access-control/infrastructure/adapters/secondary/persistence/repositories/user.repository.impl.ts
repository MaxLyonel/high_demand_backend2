// nestjs
import { Injectable } from "@nestjs/common";
// external dependencies
import { In, Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
// own implementations
import { UserRepository } from "@access-control/domain/ports/outbound/user.repository";
import { UserEntity } from "../entities/user.entity";
import { User } from "@access-control/domain/models/user.model"
import { Teacher } from "@access-control/domain/models/teacher.model";
import { TeacherEntity } from "../entities/teacher.entity";


import * as util from "util";


@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity, 'alta_demanda')
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TeacherEntity, 'alta_demanda')
    private readonly teacherRepository: Repository<TeacherEntity>
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    const userEntity = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.userRoles", "userRol")
      .leftJoinAndSelect("userRol.role", "role")
      .leftJoinAndSelect("user.person", "person")
      .leftJoinAndSelect("userRol.placeType", "placeType")
      .leftJoinAndSelect("placeType.parent", "parentPlace")
      .where("user.username = :username", { username })
      .andWhere("role.id IN (:...ids)", { ids: [9, 37, 38, 48, 50] })
      .andWhere("userRol.esactivo = true")
      .getOne();

    if (!userEntity) return null;
    // console.log(util.inspect(userEntity, { depth: null, colors: true }));
    return UserEntity.toDomain(userEntity);
  }

  async getTeacherInfo(personId: number, gestionId: number): Promise<Teacher | null> {
    const teacherEntity = await this.teacherRepository.findOne({
      where: {
        personId: personId,
        gestionId: gestionId,
        positionTypeId: In([1, 12]),
        isVigentAdmin: true
      }
    })
    if(!teacherEntity) return null
    return TeacherEntity.toDomain(teacherEntity)
  }

  async findById(id: number): Promise<User | null> {
    const userEntity = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.userRoles", "userRol")
      .leftJoinAndSelect("userRol.role", "role")
      .where("user.id = :id", { id })
      .andWhere("role.id IN (:...ids)", { ids: [9, 37, 38, 48, 50] })
      .andWhere("userRol.esactivo = true")
      .getOne();

    if (!userEntity) return null;
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      select: ['id', 'username' ]
    })
    if(!user) throw new Error('No se encontro al usuario')
    return UserEntity.toDomain(user)
  }

}