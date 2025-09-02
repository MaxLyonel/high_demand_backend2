import { Operative } from "../../models/operative.model"

export abstract class OperationsProgrammingService {

  abstract registerOpertive(obj: any): Promise<Operative>;
  abstract getRegisterOperative(gestionId: number): Promise<Operative>;
}