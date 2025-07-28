// framework
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

// own implemetation
import { EducationalInstitutionCourseRepository } from "src/modules/high-demand/application/ports/outbound/educational-institution-course.repository";
import { EducationalInstitutionCourse } from "src/modules/high-demand/domain/models/educational-institution-course.model";
import { EducationalInstitutionCourseEntity } from "../entities/educational-institution-course.entity";
import { EducationalInstitutionCourseResponse } from "src/modules/high-demand/application/dtos/educational-institution-course-response.dto";



@Injectable()
export class EducationalInstitutionCourseRepositoryImpl implements EducationalInstitutionCourseRepository {
  constructor(
    @InjectRepository(EducationalInstitutionCourseEntity, 'alta_demanda')
    private readonly educationalInstitutionCourseRepository: Repository<EducationalInstitutionCourseEntity>
  ) {}

  async findBySie(educationalInstitutionId: number, gestionTypeId: number): Promise<EducationalInstitutionCourseResponse[]> {
    const entities = await this.educationalInstitutionCourseRepository.find({
      where: { educationalInstitutionId,  gestionTypeId },
      relations: ['levelType', 'gradeType', 'parallelType']
    })
    console.log("entities: ", entities)
    // return entities.map(EducationalInstitutionCourseEntity.fromDomain)
    return entities.map((entity) => this.toDTO(entity))
  }

  private toDTO(entity: EducationalInstitutionCourseEntity): EducationalInstitutionCourseResponse {
    return {
      id: entity.id,
      educationalInstitutionId: entity.educationalInstitutionId,
      levelType: {
        id: entity.levelType.id,
        name: entity.levelType.name
      },
      gradeType: {
        id: entity.gradeType.id,
        name: entity.gradeType.name
      },
      parallelType: {
        id: entity.parallelType.id,
        name: entity.parallelType.name
      }
    }
  }

}