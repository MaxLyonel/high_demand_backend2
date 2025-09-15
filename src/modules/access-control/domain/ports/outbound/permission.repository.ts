import { ManagePermission } from '@access-control/domain/contracts/permission-manage.input';
import { Action, Permission, Resource } from '@access-control/domain/models/permission.model';
import { RolPermission } from '@access-control/domain/models/rol-permission.model';

export abstract class PermissionRepository {
  abstract findByRoleId(roleId: number): Promise<Permission[]>;
  abstract getActions(): Promise<Action[]>;
  abstract getResources(): Promise<Resource[]>;
  abstract savePermission(obj: ManagePermission): Promise<RolPermission>;
  abstract updatePermission(obj: ManagePermission): Promise<Permission>;
  abstract getOperators(): Promise<{ unnest: string }[]>;
  abstract getFields(): Promise<{ column_name: string}[]>;
  abstract updatePermissionStatus(obj: ManagePermission & {rolId: number}): Promise<RolPermission>;
  abstract getPermissions(): Promise<Permission[]>;
}