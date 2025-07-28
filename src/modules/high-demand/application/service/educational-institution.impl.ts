import { Injectable } from "@nestjs/common";
import { EducationalInstitution } from "../../domain/models/educational-institution.model";
import { EducationalInstitutionService } from "../ports/inbound/educational-institution.service";
import { EducationalInstitutionRepository } from "../ports/outbound/educational-institution.repository";





@Injectable()
export class EducationalInstitutionImpl implements EducationalInstitutionService {
  constructor(
    private readonly educationalInstitutionRepository: EducationalInstitutionRepository,
  ) {}

  async getInfoEducationalInstitution(sie: number): Promise<EducationalInstitution | null> {
    const educationalInstitution = await this.educationalInstitutionRepository.findBySie(sie)
    return educationalInstitution
  }
}