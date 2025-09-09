// framework nestjs
import { Inject, Injectable } from "@nestjs/common";
// external dependencies
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
// own implementations
import { RolPermissionEntity } from "../entities/rol-permission.entity";
import { PermissionRepository } from "@access-control/application/ports/outbound/permission.repository";
import { Permission } from "@access-control/domain/models/permission.model";
import { ActionEntity } from "../entities/action.entity";
import { ResourceEntity } from "../entities/resource.entity";
import { PermissionEntity } from "../entities/permission.entity";
import { ConditionEntity } from "../entities/condition.entity";




@Injectable()
export class PermissionRepositoryImpl implements PermissionRepository {

  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    @InjectRepository(RolPermissionEntity, 'alta_demanda')
    private readonly rolPermissionRepository: Repository<RolPermissionEntity>,
    @InjectRepository(ActionEntity, 'alta_demanda')
    private readonly actionRepository: Repository<ActionEntity>,
    @InjectRepository(ResourceEntity, 'alta_demanda')
    private readonly resourceEntity: Repository<ResourceEntity>,
    @InjectRepository(PermissionEntity, 'alta_demanda')
    private readonly permissionRepository: Repository<PermissionEntity>
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
        permission.id,
        permission.description,
        permission.active,
        permission.action,
        permission.subject,
        conditions
      )
    })
  }

  async getActions(): Promise<any> {
    const actions = await this.actionRepository.find()
    return actions
  }

  async getResources(): Promise<any> {
    const resources = await this.resourceEntity.find()
    return resources
  }

  async savePermission(obj: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      // aqui la logica de guardar condiciones
      const { action, subject, active, description, conditions, ...rest } = obj
      const newPermission = await queryRunner.manager.save(PermissionEntity,
        {
          id: obj.id ?? undefined,
          action: action,
          subject: subject,
          active,
          description
        }
      )
      if(!newPermission.id) throw new Error("No se creó el permiso");
      // creando las condiciones
      for(let condition of conditions) {
        const newCondition = await queryRunner.manager.save(ConditionEntity,
          {
            ...condition,
            permission: { id: newPermission.id }
          }
        )
        if(!newCondition.id) throw new Error("No se pudo crear la condición")
      }

      const newRolPermission = await queryRunner.manager.save(RolPermissionEntity,
        {
          rol: rest.rol,
          permission: { id: newPermission.id }
        }
      )
      if(!newRolPermission) throw new Error("No se pudo asignar el permiso al rol");
      await queryRunner.commitTransaction()
      return newRolPermission
    } catch(error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async updatePermission(obj: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const { id, rol, conditions, __typename, ...rest } = obj
      if(conditions.length) {
        for(let condition of conditions) {
          const resultCondition = await queryRunner.manager.update(
            ConditionEntity,
            { id: condition.id },
            { ...condition }
          )
          if(resultCondition.affected && resultCondition.affected == 0) {
            throw new Error("No se pudo actualizar la condición")
          } else {
          }
        }
      }
      const result = await queryRunner.manager.update(
        PermissionEntity,
        { id: obj.id },
        { ...rest }
      )
      if(result.affected && result.affected == 0) {
        throw new Error('No se pudo actualizar el permiso')
      }
      const updatedPermission = await queryRunner.manager.findOne(
        PermissionEntity,
        { where: { id: obj.id } }
      )
      await queryRunner.commitTransaction()
      return updatedPermission
    } catch(error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async getOperators(): Promise<any> {
    const query = await this.dataSource.query(
      `
        SELECT unnest(enum_range(NULL::alta_demanda.operador_enum));
      `
    )
    return query
  }

  async getFields(): Promise<any> {
    const query = await this.dataSource.query(
      `
        SELECT DISTINCT column_name
        FROM information_schema.columns
        WHERE (table_schema = 'alta_demanda')
          OR (table_schema = 'public' AND table_name IN ('usuario', 'usuario_rol', 'rol_tipo'))
        ORDER BY column_name;
      `
    )
    return query
  }

  async updatePermissionStatus(obj: any): Promise<RolPermissionEntity> {
    const { rolId, id: permissionId } = obj;

    const permiso = await this.rolPermissionRepository.findOne({
      where: { rolId, permissionId },
      relations: ["rol", "permission"]
    });
    if (!permiso) throw new Error("Permiso no encontrado");


    const newActive = !permiso.active;

    const result = await this.rolPermissionRepository.update({ rolId, permissionId }, { active: newActive });

    return this.rolPermissionRepository.findOne({
      where: { rolId, permissionId },
      relations: ["rol", "permission"]
    }) as Promise<RolPermissionEntity>;
  }

  async getPermissions(): Promise<any> {
    const permissions = await this.permissionRepository.find()
    return permissions
  }
}