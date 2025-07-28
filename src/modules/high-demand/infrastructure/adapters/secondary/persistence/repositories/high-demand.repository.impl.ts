import { Injectable } from "@nestjs/common";
import { HighDemandRepository } from "src/modules/high-demand/application/ports/outbound/high-demand.repository";
import { HighDemandRegistration } from "src/modules/high-demand/domain/models/high-demand-registration.model";



@Injectable()
export class HighDemandRepositoryImpl implements HighDemandRepository {

  constructor(){}

  findById(id: number): Promise<HighDemandRegistration> {
    throw new Error("Method not implemented.");
  }
  saveHighDemandRegistration(obj: any): Promise<boolean> {
    throw new Error("Method not implemented.");
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