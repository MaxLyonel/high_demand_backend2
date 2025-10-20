import { Injectable } from "@nestjs/common";
import { PermissionService } from "../../domain/ports/inbound/permission.service";
import { PermissionRepository } from "../../domain/ports/outbound/permission.repository";
import { Action, Permission, Resource } from "@access-control/domain/models/permission.model";
import { ManagePermission } from "@access-control/domain/contracts/permission-manage.input";
import { RolPermission } from "@access-control/domain/models/rol-permission.model";
import { NotificationPort } from "@access-control/domain/ports/outbound/notification.service";



@Injectable()
export class PermissionServiceImpl implements PermissionService {

  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly notifier: NotificationPort
  ) {}

  async getActions(): Promise<Action[]> {
    const actions = await this.permissionRepository.getActions()
    return actions
  }

  async getResources(): Promise<Resource[]> {
    const resources = await this.permissionRepository.getResources()
    return resources
  }

  async createPermission(obj: ManagePermission): Promise<RolPermission> {
    const newRolPermission = await this.permissionRepository.savePermission(obj)
    await this.notifier.notifyPermissionChange(obj.rol.id);
    return newRolPermission
  }

  async updatePermission(obj: ManagePermission): Promise<Permission> {
    const updatedPermission = await this.permissionRepository.updatePermission(obj)
    await this.notifier.notifyPermissionChange(obj.rol.id);
    return updatedPermission
  }

  async getOperators(): Promise<{ unnest: string}[]> {
    const operators = await this.permissionRepository.getOperators()
    return operators
  }

  async getFields(): Promise<{ column_name: string}[]> {
    const fields = await this.permissionRepository.getFields()
    return fields
  }

  async changePermissionStatus(obj: ManagePermission & {rolId: number}): Promise<RolPermission> {
    const updatedPermission = await this.permissionRepository.updatePermissionStatus(obj)
    await this.notifier.notifyPermissionChange(obj.rolId);
    return updatedPermission
  }

  async getPermissions(): Promise<Permission[]> {
    const permissions = await this.permissionRepository.getPermissions()
    return permissions
  }

}