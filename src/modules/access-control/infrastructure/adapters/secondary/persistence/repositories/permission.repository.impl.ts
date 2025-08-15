// framework nestjs
import { Injectable } from "@nestjs/common";
// external dependencies
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
// own implementations
import { RolPermissionEntity } from "../entities/rol-permission.entity";
import { PermissionRepository } from "@access-control/application/ports/outbound/permission.repository";
import { Permission } from "@access-control/domain/models/permission.model";




@Injectable()
export class PermissionRepositoryImpl implements PermissionRepository {

  constructor(
    @InjectRepository(RolPermissionEntity, 'alta_demanda')
    private readonly rolPermissionRepository: Repository<RolPermissionEntity>
  ) {}

  async findByRoleId(roleId: number): Promise<Permission[]> {
    const rolPermissions = await this.rolPermissionRepository.find({
      where: { rol: { id: roleId }, active: true },
      relations: ['permission', 'permission.action', 'permission.subject', 'permission.condition']
    })

    return rolPermissions.map((rp) => {
      const permission = rp.permission
      const conditions = permission.condition?.map((c) => ({
        field: c.field,
        operator: c.operator,
        value: c.value
      }))

      return new Permission(
        permission.action,
        permission.subject,
        conditions
      )
    })
  }
}