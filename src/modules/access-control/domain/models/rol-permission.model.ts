import { Permission } from "./permission.model";

export class RolPermission {
  constructor(
    public readonly permission: Permission, // el permiso real
    public readonly active: boolean = true, // corresponde a "activo"
    public readonly createdBy?: number,     // "creado_por"
    public readonly createdAt?: Date         // "creado_en"
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
