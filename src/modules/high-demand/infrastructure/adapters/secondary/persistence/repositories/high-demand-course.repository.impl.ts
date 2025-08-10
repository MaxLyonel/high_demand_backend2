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
    const coursesSaved :Array<HighDemandRegistrationCourse> = []
    for(const course of courses) {
      const newCourse = { ...course, highDemandRegistrationId: highDemandRegistrationId}
      const newHighDemandCourse = await this.highDemandRegistrationCourseEntity.save(newCourse)
      coursesSaved.push(HighDemandRegistrationCourseEntity.toDomain(newHighDemandCourse))
    }
    return coursesSaved
  }

  async modifyQuota(highDemandCourseId: number, newQuota: number): Promise<HighDemandRegistrationCourse> {
    const updatedCourse = await this.highDemandRegistrationCourseEntity.update(
      { id: highDemandCourseId },
      { totalQuota: newQuota }
    )
    if(updatedCourse.affected !== 1) {
      throw new Error("No se actualizo el cupo para este curso")
    }
    const course = await this.highDemandRegistrationCourseEntity.findOneBy({ id: highDemandCourseId });
    return HighDemandRegistrationCourseEntity.toDomain(course!);
  }

  async deleteCourse(highDemandCourseId: number): Promise<HighDemandRegistrationCourse> {
    const course = await this.highDemandRegistrationCourseEntity.findOneOrFail({
      where: { id: highDemandCourseId }
    });

    const result = await this.highDemandRegistrationCourseEntity.softDelete(highDemandCourseId);

    if (result.affected === 0) {
      throw new Error('No se encontró el curso para borrar');
    }

    return HighDemandRegistrationCourseEntity.toDomain(course);
  }

  async findById(id: number): Promise<HighDemandRegistrationCourse> {
    throw new Error("Method not implemented.");
  }

  findByHighDemandRegistrationId(highDemandRegistrationId: number): Promise<HighDemandRegistrationCourse> {
    throw new Error("Method not implemented.");
  }

}