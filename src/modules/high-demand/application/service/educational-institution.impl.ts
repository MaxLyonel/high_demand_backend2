// framework nestjs
import { Injectable } from "@nestjs/common";
// own implementations
import { EducationalInstitution } from "../../domain/models/educational-institution.model";
import { EducationalInstitutionService } from "../ports/inbound/educational-institution.service";
import { EducationalInstitutionRepository } from "../ports/outbound/educational-institution.repository";
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
}