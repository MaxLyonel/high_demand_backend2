import { Injectable } from "@nestjs/common";
import { HighDemandCourseService } from "../../domain/ports/inbound/high-demand-course.service";
import { HighDemandCourseRepository } from "../../domain/ports/outbound/high-demand-course.repository";
import { HighDemandCourseDto } from "../dtos/high-demand-course-request.dto";
import { HighDemandService } from "@high-demand/domain/ports/inbound/high-demand.service";



@Injectable()
export class HighDemanCourseImpl implements HighDemandCourseService {

  constructor(
    private readonly highDemanCourseRepository: HighDemandCourseRepository,
    private readonly highDemanService: HighDemandService
  ) {}

  async saveHighDemandCourseRegistration(obj: HighDemandCourseDto): Promise<any> {
    const { highDemand, courses } = obj
    const institutionSaved = await this.highDemanService.saveHighDemandRegistration(highDemand)
    const coursesSaved = await this.highDemanCourseRepository.saveHighDemandCourse(institutionSaved.id, courses)
    institutionSaved.courses = coursesSaved
    return { highDemandRegistration: institutionSaved }
  }

  async changeHighDemandCourseQuota(courseId: number, quota: number): Promise<any> {
    const result = await this.highDemanCourseRepository.modifyQuota(courseId, quota)
    return result
  }

}