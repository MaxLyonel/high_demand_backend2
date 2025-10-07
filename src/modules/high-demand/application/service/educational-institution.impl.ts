// framework nestjs
import { Injectable } from "@nestjs/common";
// own implementations
import { EducationalInstitutionService } from "../../domain/ports/inbound/educational-institution.service";
import { EducationalInstitutionRepository } from "../../domain/ports/outbound/educational-institution.repository";
import { EducationalInstitutionDto } from "../dtos/educational-institution-info-response.dto";


@Injectable()
export class EducationalInstitutionImpl implements EducationalInstitutionService {
  constructor(
    private readonly educationalInstitutionRepository: EducationalInstitutionRepository,
  ) {}

  async getInfoEducationalInstitution(sie: number): Promise<EducationalInstitutionDto | null> {
    const educationalInstitution = await this.educationalInstitutionRepository.findBySie(sie)
    return educationalInstitution
  }

  async searchEducationalInstitutionDistrict(sie: number): Promise<any> {
    const institution = await this.educationalInstitutionRepository.searchEducationalInstitutionDistrict(sie)
    return institution
  }
}