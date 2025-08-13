import { Rol } from "./rol.model"

export class User {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly password: string,
    public readonly isActive: boolean,
    public readonly personId: number,
    public readonly roles: Rol[]
  ) {}

  static create({
    id,
    username,
    password,
    isActive,
    personId,
    roles
  }: {
    id: number,
    username: string,
    password: string,
    isActive: boolean,
    personId: number,
    roles: Rol[]
  }): User {
    return new User(id, username, password, isActive, personId, roles)
  }
}
