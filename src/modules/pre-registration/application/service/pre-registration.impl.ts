import { Injectable } from "@nestjs/common";
import { PreRegistrationService } from "@pre-registration/domain/ports/inbound/pre-registration.service";
import { PreRegistrationRepository } from "@pre-registration/domain/ports/outbound/pre-registration.repository";




@Injectable()
export class PreRegistrationServiceImpl implements PreRegistrationService {

  constructor(
    private readonly preRegistrationRepository: PreRegistrationRepository
  ) {}

  async savePreRegistration(obj: any): Promise<any> {
    const result = await this.preRegistrationRepository.savePreRegistration(obj)
    return result
  }

  async listPreRegistration(): Promise<any> {
    const result = await this.preRegistrationRepository.getAllPreRegistration()
    return result
  }

  async lotterySelection(postulantId: number): Promise<any> {
    const result = await this.preRegistrationRepository.updateStatus(postulantId)
    return result
  }

  async getPostulantsDrawn(): Promise<any> {
    const result = await this.preRegistrationRepository.getApplicantsAcceptedStatus()
    return result
  }
}