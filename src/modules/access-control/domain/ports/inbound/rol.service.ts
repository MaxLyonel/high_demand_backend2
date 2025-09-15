import { Rol } from "@access-control/domain/models/rol.model";


export abstract class RolService {
  abstract getRoles(): Promise<Rol[]>;
}