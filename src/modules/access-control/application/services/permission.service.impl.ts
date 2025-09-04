import { Injectable } from "@nestjs/common";
import { PermissionService } from "../ports/inbound/permission.service";
import { PermissionRepository } from "../ports/outbound/permission.repository";



@Injectable()
export class PermissionServiceImpl implements PermissionService {

  constructor(
    private readonly permissionRepository: PermissionRepository
  ) {}

  async getActions(): Promise<any> {
    const actions = await this.permissionRepository.getActions()
    return actions
  }

  async getResources(): Promise<any> {
    const resources = await this.permissionRepository.getResources()
    return resources
  }

  async createPermission(obj: any): Promise<any> {
    const newRolPermission = await this.permissionRepository.savePermission(obj)
    return newRolPermission
  }

  async updatePermission(obj: any): Promise<any> {
    const updatedPermission = await this.permissionRepository.updatePermission(obj)
    return updatedPermission
  }

  async getOperators(): Promise<any> {
    const operators = await this.permissionRepository.getOperators()
    return operators
  }

  async getFields(): Promise<any> {
    const fields = await this.permissionRepository.getFields()
    return fields
  }

  async changePermissionStatus(obj: any): Promise<any> {
    const updatedPermission = await this.permissionRepository.updatePermissionStatus(obj)
    return updatedPermission
  }

  async getPermissions(): Promise<any> {
    const permissions = await this.permissionRepository.getPermissions()
    return permissions
  }

}