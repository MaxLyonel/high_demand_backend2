import { Operative } from "../../../../operations-programming/domain/operative.model"

export abstract class OperationsProgrammingService {

  abstract modifyDatePosUEIni(newDate: Date): Promise<Operative>;
  abstract modifyDatePosUEEnd(newDate: Date): Promise<Operative>;
  abstract modifyDateRevDisIni(newDate: Date): Promise<Operative>;
  abstract modifyDateRevDisEnd(newDate: Date): Promise<Operative>;
  abstract modifyDateRevDepIni(newDate: Date): Promise<Operative>;
  abstract modifyDateRevDepEnd(newDate: Date): Promise<Operative>;
  abstract modifyDateOpeIni(newDate: Date): Promise<Operative>;
  abstract modifyDateOpeEnd(newDate: Date): Promise<Operative>;

}