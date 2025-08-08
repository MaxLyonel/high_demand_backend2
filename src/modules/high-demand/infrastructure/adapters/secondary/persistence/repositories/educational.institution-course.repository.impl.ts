import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { EducationalInstitutionCourseRepository } from "@high-demand/application/ports/outbound/educational-institution-course.repository";
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
    console.log("cursos estructura: ", entities)

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
      let level = grouped.find((l) => l.levelId === item.levelType.id);
      if (!level) {
        level = {
          levelId: item.levelType.id,
          levelName: item.levelType.name,
          grades: [],
        };
        grouped.push(level);
      }

      let grade = level.grades.find((g) => g.gradeId === item.gradeType.id);
      if (!grade) {
        grade = {
          gradeId: item.gradeType.id,
          gradeName: item.gradeType.name,
          parallels: [],
        };
        level.grades.push(grade);
      }

      let parallel = grade.parallels.find((p) => p.parallelId === item.parallelType.id);
      if (!parallel) {
        parallel = {
          parallelId: item.parallelType.id,
          parallelName: item.parallelType.name,
        };
        grade.parallels.push(parallel);
      }
    });

    grouped.sort((a, b) => a.levelId - b.levelId);

    grouped.forEach(level => {
      level.grades.sort((a, b) => a.gradeId - b.gradeId);

      level.grades.forEach(grade => {
        grade.parallels.sort((a, b) => a.parallelId - b.parallelId);
      });
    });

    return grouped;
  }
}
