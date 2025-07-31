import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HighDemandRepository } from "src/modules/high-demand/application/ports/outbound/high-demand.repository";
import { HighDemandRegistration } from "src/modules/high-demand/domain/models/high-demand-registration.model";
import { HighDemandRegistrationEntity } from "../entities/high-demand.entity";
import { Repository } from "typeorm";
import { RegistrationStatus } from "src/modules/high-demand/domain/enums/registration-status.enum";


interface NewHighDemandRegistration {
  id: number,
  educationalInstitutionId: number;
  userId: number;
  currentWorkflowState: string;
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