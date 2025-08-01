import { User } from "@access-control/domain/models/user.model";

export abstract class AuthService {
  abstract getProfile(userId: number): Promise<User>;
  abstract login(user: User): Promise<{ access_token: string }>;
  abstract validateUser(username: string, password: string): Promise<User | null>;
}