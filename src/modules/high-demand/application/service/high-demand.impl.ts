import { Injectable } from "@nestjs/common";
import { HighDemandService } from "../ports/inbound/high-demand.service";
import { HighDemandRepository } from "../ports/outbound/high-demand.repository";
import { EducationalInstitution } from "../../domain/models/educational-institution.model";
import { HighDemandRegistration } from "../../domain/models/high-demand-registration.model";
import { HighDemandRegistrationEntity } from "../../infrastructure/adapters/secondary/persistence/entities/high-demand.entity";


@Injectable()
export class HighDemandRegistrationImpl implements HighDemandService {
  constructor(
    private readonly highDemandRepository: HighDemandRepository
  ) {}

  async saveHighDemandRegistration(obj: HighDemandRegistration): Promise<HighDemandRegistration> {
    // Paso 1: buscar registros previos de esa institución en ese operativo
    console.log("ingresa acas", obj)
    const existingRegistrations = await this.highDemandRepository.findInscriptions(obj)

    // Paso 2: aplicar la lógica del dominio
    const domain = HighDemandRegistration.create({
      ...obj,
      existingRegistrations
    });

    // Paso 3: convertir a entidad y guardar
    const entity = HighDemandRegistrationEntity.fromDomain(domain);
    const saved = await this.highDemandRepository.saveHighDemandRegistration(entity)
    // return HighDemandRegistrationEntity.toDomain(saved)
    return saved
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