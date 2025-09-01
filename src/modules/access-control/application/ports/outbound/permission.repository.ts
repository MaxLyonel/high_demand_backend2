import { Permission } from '@access-control/domain/models/permission.model';

export abstract class PermissionRepository {
  abstract findByRoleId(roleId: number): Promise<Permission[]>;
  abstract getActions(): Promise<any>;
  abstract getResources(): Promise<any>;
  abstract savePermission(obj: any): Promise<any>;
  abstract getOperators(): Promise<any>;
  abstract getFields(): Promise<any>;
  abstract updatePermissionStatus(obj: any): Promise<any>;
}