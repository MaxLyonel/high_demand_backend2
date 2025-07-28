import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EducationalInstitutionEntity } from "../entities/educational-institution.entity";
import { Repository } from "typeorm";
import { EducationalInstitution } from "src/modules/high-demand/domain/models/educational-institution.model";
import { EducationalInstitutionRepository } from "src/modules/high-demand/application/ports/outbound/educational-institution.repository";




@Injectable()
export class EducationalInstitutionRepositoryImpl implements EducationalInstitutionRepository {
  constructor(
    @InjectRepository(EducationalInstitutionEntity, 'alta_demanda')
    private readonly educationalInstitutionRepository: Repository<EducationalInstitutionEntity>
  ) {}

  async findBySie(id: number): Promise<EducationalInstitution | null> {
    const educationalInstitutinEntity = await this.educationalInstitutionRepository.findOne({ where: { id }})
    if(!educationalInstitutinEntity) return null
    return EducationalInstitutionEntity.toDomain(educationalInstitutinEntity)
  }
}