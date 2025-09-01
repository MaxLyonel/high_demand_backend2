import { RolRepository } from "@access-control/application/ports/outbound/rol.repository";
import { Rol } from "@access-control/domain/models/rol.model";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolTypeEntity } from "../entities/rol-type.entity";
import { In, Repository } from "typeorm";


@Injectable()
export class RolRepositoryImpl implements RolRepository {

  constructor(
    @InjectRepository(RolTypeEntity, 'alta_demanda')
    private readonly _rolRepository: Repository<RolTypeEntity>
  ) {}

  async find(): Promise<Rol[]> {
    const roles = await this._rolRepository.find({
      where: {
        id: In([9, 37, 38, 48, 49])
      }
    })
    return roles.map(RolTypeEntity.toDomain)
  }

  async findById(id: number): Promise<Rol> {
    const rol = await this._rolRepository.findOne({
      where: {
        id: id
      },
      select: ['id', 'name']
    })
    if(!rol) throw new Error('Rol no encontrado')
    return RolTypeEntity.toDomain(rol)
  }

}