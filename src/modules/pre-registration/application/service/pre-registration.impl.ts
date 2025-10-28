import { Injectable } from "@nestjs/common";
import { PreRegistrationService } from "@pre-registration/domain/ports/inbound/pre-registration.service";
import { PreRegistrationRepository } from "@pre-registration/domain/ports/outbound/pre-registration.repository";




@Injectable()
export class PreRegistrationServiceImpl implements PreRegistrationService {

  constructor(
    private readonly preRegistrationRepository: PreRegistrationRepository,
  ) {}

  async savePreRegistration(obj: any): Promise<any> {
    const result = await this.preRegistrationRepository.savePreRegistration(obj)
    return result
  }

  async invalidatePreRegistration(obj: any): Promise<any> {
    const result = await this.preRegistrationRepository.invalidatePreRegistration(obj)
    return result
  }

  async validatePreRegistration(obj: any): Promise<any> {
    const result = await this.preRegistrationRepository.validatePreRegistration(obj)
    return result
  }

  async acceptPreRegistrations(obj: any): Promise<any> {
    const results = await this.preRegistrationRepository.acceptPreRegistrations(obj)
    return results
  }

  async listPreRegistration(highDemandId: number): Promise<any> {
    const result = await this.preRegistrationRepository.getAllPreRegistration(highDemandId)
    return result
  }

  async listValidPreRegistrations(highDemandId: number, levelId: number, gradeId: number): Promise<any> {
    const result = await this.preRegistrationRepository.getValidPreRegistrations(highDemandId, levelId, gradeId)
    return result
  }

  async listPreRegistrationFollow(identityCardPostulant: string): Promise<any> {
    const result = await this.preRegistrationRepository.getPreRegistrationFollow(identityCardPostulant)
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

  async obtainPreRegistrationInformation(postulantId: number): Promise<any> {
    const result = await this.preRegistrationRepository.getPreRegistrationInfo(postulantId)
    return result
  }

  async getPreRegistration(postulantId: number): Promise<any> {
    const info = await this.preRegistrationRepository.getPreRegistrationInfo(postulantId)
    return info
  }
}