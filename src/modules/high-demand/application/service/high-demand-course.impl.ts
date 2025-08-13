import { Injectable } from "@nestjs/common";
import { HighDemandCourseService } from "../../domain/ports/inbound/high-demand-course.service";
import { HighDemandCourseRepository } from "../../domain/ports/outbound/high-demand-course.repository";
import { HighDemandCourseDto } from "../dtos/high-demand-course-request.dto";
import { HighDemandService } from "@high-demand/domain/ports/inbound/high-demand.service";
import { HighDemandRegistrationCourse } from "@high-demand/domain/models/high-demand-registration-course.model";
import { HighDemandCourseDtoReponse } from "../dtos/high-demand-course-response.dto";
// import { UnitOfWork } from "@high-demand/domain/ports/outbound/unit-of-work";



@Injectable()
export class HighDemanCourseImpl implements HighDemandCourseService {

  constructor(
    private readonly highDemanCourseRepository: HighDemandCourseRepository,
    private readonly highDemanService: HighDemandService,
    // private readonly unitOfWork: UnitOfWork
  ) {}

  async saveHighDemandCourseRegistration(obj: HighDemandCourseDto): Promise<any> {
    // return this.unitOfWork.start(async () => {
      const { highDemand, courses } = obj
      const institutionSaved = await this.highDemanService.saveHighDemandRegistration(highDemand, courses)
      return { highDemandRegistration: institutionSaved }
    // })
  }

  async changeHighDemandCourseQuota(courseId: number, quota: number): Promise<any> {
    const updatedCourse = await this.highDemanCourseRepository.modifyQuota(courseId, quota)
    return updatedCourse
  }

  async deleteCourse(courseId: number): Promise<HighDemandRegistrationCourse> {
    const deletedCourse = await this.highDemanCourseRepository.deleteCourse(courseId)
    return deletedCourse
  }

  async getCourse(highDemandRegistrationId: number): Promise<HighDemandCourseDtoReponse[]> {
    const courses = await this.highDemanCourseRepository.findByHighDemandRegistrationId(highDemandRegistrationId)
    return courses
  }

}