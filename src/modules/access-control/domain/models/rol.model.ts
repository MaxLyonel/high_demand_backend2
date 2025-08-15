import { Permission } from "./permission.model";

export class Rol {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public permissions: Permission[]
  ){}

  static create({
    id,
    name,
    permissions
  }: {
    id: number,
    name: string,
    permissions: Permission[]
  }): Rol {
    return new Rol(id, name, permissions)
  }
}