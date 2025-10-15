import { HistoryService } from "@high-demand/domain/ports/inbound/history.service";
import { HistoryRepository } from "@high-demand/domain/ports/outbound/history.repository";
import { Injectable } from "@nestjs/common";
import { History } from "@high-demand/domain/models/history.model"


@Injectable()
export class HistoryServiceImpl implements HistoryService {

  constructor(
    private readonly _historyRepository: HistoryRepository
  ) {}

  async historyList(highDemandRegistrationId: number): Promise<History[]> {
    const histories = await this._historyRepository.getHistory(highDemandRegistrationId)
    return histories
  }

  async historiesList(): Promise<History[]> {
    const histories = await this._historyRepository.getHistories()
    return histories
  }

  async getHighDemandsByDistrict(districtId: number): Promise<any[]> {
    const highDemands = await this._historyRepository.getHighDemands(districtId);
    return highDemands
  }
}