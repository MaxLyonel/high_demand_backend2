import { Permission } from "./permission.model";
import { RolPermission } from "./rol-permission.model";

export class Rol {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public rolPermissions: RolPermission[]
  ){}

  static create({
    id,
    name,
    rolPermissions
  }: {
    id: number,
    name: string,
    rolPermissions: RolPermission[]
  }): Rol {
    return new Rol(id, name, rolPermissions)
  }
}