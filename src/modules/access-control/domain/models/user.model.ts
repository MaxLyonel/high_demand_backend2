import { Rol } from "./rol.model"
import { UserRole } from "./user-role.model"

export class User {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly password: string,
    public readonly isActive: boolean,
    public readonly person: any,
    // public readonly roles: Rol[]
    public readonly roles: UserRole[]
  ) {}

  static create({
    id,
    username,
    password,
    isActive,
    person,
    roles
  }: {
    id: number,
    username: string,
    password: string,
    isActive: boolean,
    person: any,
    roles: UserRole[]
  }): User {
    return new User(id, username, password, isActive, person, roles)
  }
}
