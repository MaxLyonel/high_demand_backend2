import { ManagePermission } from "@access-control/domain/contracts/permission-manage.input";
import { Action, Permission, Resource } from "@access-control/domain/models/permission.model";
import { RolPermission } from "@access-control/domain/models/rol-permission.model";




export abstract class PermissionService {
  abstract getActions(): Promise<Action[]>;
  abstract getResources(): Promise<Resource[]>;
  abstract createPermission(obj: ManagePermission): Promise<RolPermission>;
  abstract updatePermission(obj: ManagePermission): Promise<Permission>;
  abstract getOperators(): Promise<{ unnest: string }[]>;
  abstract getFields(): Promise<{ column_name: string}[]>;
  abstract changePermissionStatus(state: ManagePermission & {rolId: number}): Promise<RolPermission>;
  abstract getPermissions(): Promise<Permission[]>;
}