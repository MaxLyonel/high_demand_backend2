import { RolRepository } from "@access-control/application/ports/outbound/rol.repository";
import { Rol } from "@access-control/domain/models/rol.model";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolTypeEntity } from "../entities/rol-type.entity";
import { Repository } from "typeorm";


@Injectable()
export class RolRepositoryImpl implements RolRepository {

  constructor(
    @InjectRepository(RolTypeEntity, 'alta_demanda')
    private readonly _rolRepository: Repository<RolTypeEntity>
  ) {}

  async find(): Promise<Rol[]> {
    const roles = await this._rolRepository.find()
    return roles.map(RolTypeEntity.toDomain(roles))
  }
  findById(): Promise<Rol> {
    throw new Error("Method not implemented.");
  }

}