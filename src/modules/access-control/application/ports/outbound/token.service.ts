import { User } from "@access-control/domain/models/user.model"

export abstract class TokenService {
  abstract generateToken(user: User): string;
  abstract verifyToken(token: string): { userId: string };
}