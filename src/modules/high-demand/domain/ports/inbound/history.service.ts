
import { History } from "@high-demand/domain/models/history.model";


export abstract class HistoryService {
  abstract historyList(highDemandRegistrationId: number): Promise<History[]>;
}