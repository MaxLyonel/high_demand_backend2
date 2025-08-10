// framework nestjs
import { Injectable } from "@nestjs/common";
// external independencies
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
// own implementations
import { HighDemandRepository } from "@high-demand/domain/ports/outbound/high-demand.repository"
import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model"
import { HighDemandRegistrationEntity } from "../entities/high-demand.entity";
import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum"


interface NewHighDemandRegistration {
  id: number,
  educationalInstitutionId: number;
  userId: number;
  workflowStateId: number;
  workflowId: number;
  registrationStatus: RegistrationStatus;
  inbox: boolean;
  operativeId: number;
}


@Injectable()
export class HighDemandRepositoryImpl implements HighDemandRepository {

  constructor(
    @InjectRepository(HighDemandRegistrationEntity, 'alta_demanda')
    private readonly highDemandRegistrationRepository: Repository<HighDemandRegistrationEntity>
  ){}

  async findInscriptions(obj: NewHighDemandRegistration): Promise<HighDemandRegistration[]> {
    const highDemandsRegisteredEntities = await this.highDemandRegistrationRepository.find({
      where: {
        educationalInstitutionId: obj.id,
        operativeId: obj.operativeId
      }
    });

    const existingRegistrations = highDemandsRegisteredEntities.map(e =>
      HighDemandRegistrationEntity.toDomain(e)
    )

    return existingRegistrations
  }

  async findById(id: number): Promise<HighDemandRegistration | null> {
    const highDemandRegistrationEntity = await this.highDemandRegistrationRepository.findOne({ where: { id }})
    if(!highDemandRegistrationEntity) return null
    return HighDemandRegistrationEntity.toDomain(highDemandRegistrationEntity)
  }
  async saveHighDemandRegistration(obj: NewHighDemandRegistration): Promise<HighDemandRegistration> {
    const newHighDemandRegistration = await this.highDemandRegistrationRepository.save(obj)
    return HighDemandRegistrationEntity.toDomain(newHighDemandRegistration)
  }
  modifyHighDemanRegistration(obj: any): Promise<HighDemandRegistration> {
    throw new Error("Method not implemented.");
  }
  updateStatusHighDeman(id: number, newStatus: any): Promise<HighDemandRegistration> {
    throw new Error("Method not implemented.");
  }
  onATray(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  udpateFlowStatus(id: number, nextFlowStatus: number): Promise<HighDemandRegistration> {
    throw new Error("Method not implemented.");
  }

}