import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto";
import { History } from "@high-demand/domain/models/history.model";


export abstract class HistoryRepository {
  abstract updatedHistory(obj: CreateHistoryDto): Promise<any>;
  abstract getHistory(highDemandRegistrationId: number): Promise<History[]>;
  abstract getHistories(): Promise<History[]>;
}