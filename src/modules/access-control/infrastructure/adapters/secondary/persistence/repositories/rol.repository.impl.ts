import { RolRepository } from "@access-control/domain/ports/outbound/rol.repository";
import { Rol } from "@access-control/domain/models/rol.model";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolTypeEntity } from "../entities/rol-type.entity";
import { Repository } from "typeorm";
import { RolPermissionEntity } from "../entities/rol-permission.entity";


@Injectable()
export class RolRepositoryImpl implements RolRepository {

  constructor(
    @InjectRepository(RolTypeEntity, 'alta_demanda')
    private readonly _rolRepository: Repository<RolTypeEntity>
  ) {}

  async find(): Promise<Rol[]> {
    const roles = await this._rolRepository
      .createQueryBuilder("rol")
      .leftJoinAndSelect("rol.rolPermissions", "rolPerm")
      .leftJoinAndSelect("rolPerm.permission", "perm")
      .leftJoinAndSelect("perm.action", "action")
      .leftJoinAndSelect("perm.subject", "subject")
      .leftJoinAndSelect("perm.condition", "conditions")
      .where("rol.id IN (:...ids)", { ids: [9, 37, 38, 48, 49] })
      .getMany();

    const res = roles.map(rol => ({
      id: rol.id,
      name: rol.name,
      rolPermissions: rol.rolPermissions.map(RolPermissionEntity.toDomain)
    }));
    return res
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