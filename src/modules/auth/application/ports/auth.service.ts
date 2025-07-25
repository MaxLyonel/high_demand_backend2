import { User } from "../../domain/models/user.model";


export abstract class AuthService {
  abstract validateUser(username: string, password: string): Promise<User | null>;
  abstract login(user: User): Promise<{ access_token: string }>;
  abstract getProfile(userId: number): Promise<User>;
}