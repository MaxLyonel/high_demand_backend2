// framework nestjs
import { Injectable } from "@nestjs/common";
// external dependencies
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
// own implementations
import { EducationalInstitutionEntity } from "../entities/educational-institution.entity";
import { EducationalInstitution } from "@high-demand/domain/models/educational-institution.model"
import { EducationalInstitutionRepository } from "@high-demand/application/ports/outbound/educational-institution.repository"




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