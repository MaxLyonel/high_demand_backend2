import { Injectable } from "@nestjs/common";
import { OperationsProgrammingService } from "../../domain/ports/inbound/operations-programming.service";
import { Operative } from "../../domain/models/operative.model";
import { OperativeProgrammingRepositoryImpl } from "../../infrastructure/adapters/secondary/persistence/repositories/operative-programming.service.impl";
import { OperationsProgrammingRepository } from "../../domain/ports/outbound/operations-programming.repository";

@Injectable()
export class OperationsProgrammingServiceImpl implements OperationsProgrammingService {

  constructor(
    private readonly operativeRepository: OperationsProgrammingRepository
  ) {}

  async registerOpertive(obj: any): Promise<Operative> {
    const newOperative = await this.operativeRepository.saveOperative(obj)
    return newOperative
  }

  async getRegisterOperative(gestionId: number): Promise<Operative | null> {
    const operative = await this.operativeRepository.getOperative(gestionId)
    return operative
  }

}