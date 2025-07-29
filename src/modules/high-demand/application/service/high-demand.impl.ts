import { Injectable } from "@nestjs/common";
import { HighDemandService } from "../ports/inbound/high-demand.service";
import { HighDemandRepository } from "../ports/outbound/high-demand.repository";
import { EducationalInstitution } from "../../domain/models/educational-institution.model";
import { HighDemandRegistration } from "../../domain/models/high-demand-registration.model";


@Injectable()
export class HighDemandRegistrationImpl implements HighDemandService {
  constructor(
    private readonly highDemandRepository: HighDemandRepository
  ) {}

  async saveHighDemandRegistration(sie: number): Promise<HighDemandRegistration> {
    const newHighDemand = await this.highDemandRepository.saveHighDemandRegistration(sie)
    return newHighDemand
  }
  cancelHighDemands(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  listHighDemands(): Promise<EducationalInstitution[]> {
    throw new Error("Method not implemented.");
  }
  modifyHighDemand(): Promise<HighDemandRegistration> {
    throw new Error("Method not implemented.");
  }
  changeHighDemandStatus(): Promise<any> {
    throw new Error("Method not implemented.");
  }


}