import { Permission } from "./permission.model";

export class Rol {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public placeLevelTypeId: number,
    public permissions: Permission[]
  ){}

  static create({
    id,
    name,
    placeLevelTypeId,
    permissions
  }: {
    id: number,
    name: string,
    placeLevelTypeId: number,
    permissions: Permission[]
  }): Rol {
    return new Rol(id, name, placeLevelTypeId, permissions)
  }
}