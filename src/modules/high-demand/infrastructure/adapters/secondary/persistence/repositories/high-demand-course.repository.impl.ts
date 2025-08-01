// framework nestjs
import { Injectable } from "@nestjs/common";
// external dependencies
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
// own implementations
import { HighDemandCourseRepository } from "@high-demand/application/ports/outbound/high-demand-course.repository"
import { HighDemandRegistrationCourse } from "@high-demand/domain/models/high-demand-registration-course.model"
import { HighDemandRegistrationCourseEntity } from '../entities/high-demand-course.entity';


@Injectable()
export class HighDemandCourseRepositoryImpl implements HighDemandCourseRepository {

  constructor(
    @InjectRepository(HighDemandRegistrationCourseEntity, 'alta_demanda')
    private readonly highDemandRegistrationCourseEntity: Repository<HighDemandRegistrationCourseEntity>
  ) {}

  saveHighDemandCourse(obj: any): Promise<HighDemandRegistrationCourse> {
    throw new Error("Method not implemented.");
  }

  async findById(id: number): Promise<HighDemandRegistrationCourse> {
    // const highDemandRegistrationCourses = await this.highDemandRegistrationCourseEntity.find({
    //   where: {
    //     highDemandRegistrationId: id
    //   }
    // })
    // const list = highDemandRegistrationCourses.map(e =>
    //   HighDemandRegistrationCourseEntity.toDomain(e)
    // )

    // return list;
    throw new Error("Method not implemented.");
  }

  findByHighDemandRegistrationId(highDemandRegistrationId: number): Promise<HighDemandRegistrationCourse> {
    throw new Error("Method not implemented.");
  }

}