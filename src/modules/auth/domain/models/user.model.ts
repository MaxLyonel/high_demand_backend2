
export class User {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly password: string,
    public readonly isActive: boolean,
    public readonly personId: number
  ) {}

  static create({
    id,
    username,
    password,
    isActive,
    personId
  }: {
    id: number,
    username: string,
    password: string,
    isActive: boolean,
    personId: number
  }): User {
    return new User(id, username, password, isActive, personId)
  }
}
