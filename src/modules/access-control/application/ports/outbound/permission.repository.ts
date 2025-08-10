import { Permission } from '@access-control/domain/models/permission.model';

export abstract class PermissionRepository {
  abstract findByRoleId(roleId: number): Promise<Permission[]>;
}