import { User } from "src/modules/access-control/domain/models/user.model";


export abstract class TokenService {
  abstract generateToken(user: User): string;
  abstract verifyToken(token: string): { userId: string };
}