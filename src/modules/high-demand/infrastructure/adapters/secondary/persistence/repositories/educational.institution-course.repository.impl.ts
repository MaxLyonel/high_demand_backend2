import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { EducationalInstitutionCourseRepository } from "@high-demand/domain/ports/outbound/educational-institution-course.repository";
import { EducationalInstitutionCourseEntity } from "../entities/educational-institution-course.entity";
import {
  EducationalInstitutionCourseResponse,
  GroupedEducationalInstitutionCourses,
} from "@high-demand/application/dtos/educational-institution-course-response.dto";

@Injectable()
export class EducationalInstitutionCourseRepositoryImpl implements EducationalInstitutionCourseRepository {
  constructor(
    @InjectRepository(EducationalInstitutionCourseEntity, "alta_demanda")
    private readonly educationalInstitutionCourseRepository: Repository<EducationalInstitutionCourseEntity>
  ) {}

  async findBySie(
    educationalInstitutionId: number,
    gestionTypeId: number
  ): Promise<GroupedEducationalInstitutionCourses> {
    const entities = await this.educationalInstitutionCourseRepository.find({
      where: { educationalInstitutionId, gestionTypeId },
      relations: ["levelType", "gradeType", "parallelType"],
    });

    const dtos = entities.map((entity) => this.toDTO(entity));
    return this.groupByLevelGradeParallel(dtos);
  }

  private toDTO(entity: EducationalInstitutionCourseEntity): EducationalInstitutionCourseResponse {
    return {
      id: entity.id,
      educationalInstitutionId: entity.educationalInstitutionId,
      levelType: {
        id: entity.levelType.id,
        name: entity.levelType.name,
      },
      gradeType: {
        id: entity.gradeType.id,
        name: entity.gradeType.name,
      },
      parallelType: {
        id: entity.parallelType.id,
        name: entity.parallelType.name,
      },
    };
  }

  private groupByLevelGradeParallel(
    data: EducationalInstitutionCourseResponse[]
  ): GroupedEducationalInstitutionCourses {
    const grouped: GroupedEducationalInstitutionCourses = [];

    data.forEach((item) => {
      let level = grouped.find((l) => l.id === item.levelType.id);
      if (!level) {
        level = {
          id: item.levelType.id,
          name: item.levelType.name,
          grades: [],
        };
        grouped.push(level);
      }

      let grade = level.grades.find((g) => g.id === item.gradeType.id);
      if (!grade) {
        grade = {
          id: item.gradeType.id,
          name: item.gradeType.name,
          parallels: [],
        };
        level.grades.push(grade);
      }

      let parallel = grade.parallels.find((p) => p.id === item.parallelType.id);
      if (!parallel) {
        parallel = {
          id: item.parallelType.id,
          name: item.parallelType.name,
        };
        grade.parallels.push(parallel);
      }
    });

    grouped.sort((a, b) => a.id - b.id);

    grouped.forEach(level => {
      level.grades.sort((a, b) => a.id - b.id);

      level.grades.forEach(grade => {
        grade.parallels.sort((a, b) => a.id - b.id);
      });
    });

    return grouped;
  }
}
