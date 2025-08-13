import { Rol } from "@access-control/domain/models/rol.model";


export abstract class RolService {
  abstract getRoles(): Promise<Rol[]>;
  abstract getRol(id: number): Promise<Rol>;
}