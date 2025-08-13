import { Rol } from "@access-control/domain/models/rol.model";



export abstract class RolRepository {
  abstract find(): Promise<Rol[]>;
  abstract findById(): Promise<Rol>;
}