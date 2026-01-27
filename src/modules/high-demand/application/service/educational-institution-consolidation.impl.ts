import { EducationalInstitutionConsolidationService } from "@high-demand/domain/ports/inbound/educational-institution-consolidation.service";
import { EducationalInstitutionConsolidationRepository } from "@high-demand/domain/ports/outbound/educational-institution-consolidation.repository";
import { Injectable } from "@nestjs/common";


@Injectable()
export class EducationalInstitutionConsolidationImpl implements EducationalInstitutionConsolidationService {
  constructor(
    private readonly educationalInstitutionConsolidationRespository: EducationalInstitutionConsolidationRepository
  ) {}

  async consolidateEducationalInstitution(sie: number): Promise<any> {
    const consolidation = await this.educationalInstitutionConsolidationRespository.consolidate(sie)
    return consolidation
  }

  async checkConsolidation(sie: number): Promise<any> {
    const check = await this.educationalInstitutionConsolidationRespository.check(sie)
    return check
  }
}