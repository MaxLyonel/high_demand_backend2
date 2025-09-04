import { HistoryRepository } from "@high-demand/domain/ports/outbound/history.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HistoryEntity } from "../entities/history.entity";
import { History } from "@high-demand/domain/models/history.model";
import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto";


@Injectable()
export class HistoryRepositoryImpl implements HistoryRepository {

  constructor(
    @InjectRepository(HistoryEntity, 'alta_demanda') private _historyRepository: Repository<HistoryEntity>
  ) {}

  async updatedHistory(obj: CreateHistoryDto): Promise<any> {
    const updatedHistory = await this._historyRepository.insert(obj)
    if(updatedHistory.identifiers.length <= 0) throw new Error("No se pudo actualizar el historial");
    return updatedHistory
  }

  async getHistory(highDemandRegistrationId: number): Promise<History[]> {
    const histories = await this._historyRepository.find({
      where: {
        highDemandRegistration: { id: highDemandRegistrationId }
      },
      withDeleted: true,
      relations: ['highDemandRegistration.educationalInstitution', 'user', 'workflowState', 'rol']
    });

    return histories.map(entity => {
      return new History(
        entity.id,
        entity.highDemandRegistration.id,
        entity.highDemandRegistration.educationalInstitution?.id,
        entity.highDemandRegistration.educationalInstitution?.name,
        entity.userId,
        entity.user.username,
        entity.rol.name,
        entity.rol.id,
        entity.workflowState.name,
        entity.registrationStatus,
        entity.observation,
        entity.createdAt,
        entity.updatedAt
      );
    });
  }

  async getHistories(): Promise<History[]> {
    const histories = await this._historyRepository.find({
      withDeleted: true,
      relations: ['highDemandRegistration.educationalInstitution', 'user', 'workflowState', 'rol']
    })
    return histories.map(entity => {
      return new History(
        entity.id,
        entity.highDemandRegistration.id,
        entity.highDemandRegistration.educationalInstitution?.id,
        entity.highDemandRegistration.educationalInstitution?.name,
        entity.userId,
        entity.user.username,
        entity.rol.name,
        entity.rol.id,
        entity.workflowState.name,
        entity.registrationStatus,
        entity.observation,
        entity.createdAt,
        entity.updatedAt
      )
    })
  }
}