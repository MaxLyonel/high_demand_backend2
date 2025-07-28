import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EducationalInstitutionEntity } from "../entities/educational-institution.entity";
import { Repository } from "typeorm";
import { EducationalInstitutionRepository } from "src/modules/high-demand/domain/repositories/educational-institution.repository";
import { EducationalInstitution } from "src/modules/high-demand/domain/models/educational-institution.model";




@Injectable()
export class EducationalInstitutionImpl implements EducationalInstitutionRepository {
  constructor(
    @InjectRepository(EducationalInstitutionEntity, 'alta_demanda')
    private readonly educationalRepository: Repository<EducationalInstitutionEntity>
  ) {}

  async findBySie(id: number): Promise<EducationalInstitution | null> {
    const educationalInstitutinEntity = await this.educationalRepository.findOne({ where: { id }})
    if(!educationalInstitutinEntity) return null
    return EducationalInstitutionEntity.toDomain(educationalInstitutinEntity)
  }

  async findByDirector(personId: number): Promise<EducationalInstitution | null> {
    const educationalInstitutionEntity = await this.educationalRepository.findOne({ where: { personId } })
    if(!educationalInstitutionEntity) return null
    return EducationalInstitutionEntity.toDomain(educationalInstitutionEntity)
  }
}