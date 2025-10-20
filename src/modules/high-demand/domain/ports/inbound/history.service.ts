
import { History } from "@high-demand/domain/models/history.model";


export abstract class HistoryService {
  abstract historyList(highDemandRegistrationId: number): Promise<History[]>;
  abstract historiesList(user: any): Promise<History[]>
  abstract getHighDemandsByDistrict(districtId: number): Promise<any[]>;
  abstract getHighDemandsByDepartment(departmentId: number): Promise<any[]>;
}