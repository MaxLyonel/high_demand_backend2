import { Permission } from "./permission.model";

export class RolPermission {
  constructor(
    public readonly permission: Permission,
    public readonly active: boolean = true,
    public readonly createdBy?: number,
    public readonly createdAt?: Date
  ) {}

  static create(params: {
    permission: Permission;
    active?: boolean;
    createdBy?: number;
    createdAt?: Date;
  }): RolPermission {
    return new RolPermission(
      params.permission,
      params.active ?? true,
      params.createdBy,
      params.createdAt
    );
  }
}
