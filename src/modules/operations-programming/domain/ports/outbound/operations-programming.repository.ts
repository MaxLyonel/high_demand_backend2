import { Operative } from "../../models/operative.model";



export abstract class OperationsProgrammingRepository {
  abstract saveOperative(obj: any): Promise<Operative>;
  abstract getOperative(gestionId: number): Promise<Operative>;
}