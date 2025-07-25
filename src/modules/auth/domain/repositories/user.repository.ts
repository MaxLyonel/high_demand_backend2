import { User } from "../models/user.model";


export abstract class UserRepository {
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findById(id: number): Promise<User | null>;
}