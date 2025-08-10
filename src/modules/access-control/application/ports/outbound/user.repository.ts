import { Teacher } from "@access-control/domain/models/teacher.model";
import { User } from "@access-control/domain/models/user.model";

export abstract class UserRepository {
  abstract findById(id: number): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract getTeacherInfo(personId: number, gestionId: number): Promise<Teacher | null>;
}