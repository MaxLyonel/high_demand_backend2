// framework nestjs
import { Injectable } from "@nestjs/common";
// external dependencies
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
// own implementations
import { HighDemandCourseRepository } from "@high-demand/domain/ports/outbound/high-demand-course.repository"
import { HighDemandRegistrationCourse } from "@high-demand/domain/models/high-demand-registration-course.model"
import { HighDemandRegistrationCourseEntity } from '../entities/high-demand-course.entity';


@Injectable()
export class HighDemandCourseRepositoryImpl implements HighDemandCourseRepository {

  constructor(
    @InjectRepository(HighDemandRegistrationCourseEntity, 'alta_demanda')
    private readonly highDemandRegistrationCourseEntity: Repository<HighDemandRegistrationCourseEntity>
  ) {}

  async saveHighDemandCourse(highDemandRegistrationId: number, courses: any): Promise<HighDemandRegistrationCourse[]> {
    console.log("Creando los cursos Alta Demanda: ", courses)
    const coursesSaved :Array<HighDemandRegistrationCourse> = []
    for(const course of courses) {
      const newCourse = { ...course, highDemandRegistrationId: highDemandRegistrationId}
      console.log("new Course", newCourse)
      const newHighDemandCourse = await this.highDemandRegistrationCourseEntity.save(newCourse)
      coursesSaved.push(HighDemandRegistrationCourseEntity.toDomain(newHighDemandCourse))
    }
    return coursesSaved
  }

  async findById(id: number): Promise<HighDemandRegistrationCourse> {
    throw new Error("Method not implemented.");
  }

  findByHighDemandRegistrationId(highDemandRegistrationId: number): Promise<HighDemandRegistrationCourse> {
    throw new Error("Method not implemented.");
  }

}