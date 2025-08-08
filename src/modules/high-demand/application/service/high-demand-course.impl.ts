import { Injectable } from "@nestjs/common";
import { HighDemandCourseService } from "../../domain/ports/inbound/high-demand-course.service";
import { HighDemandCourseRepository } from "../../domain/ports/outbound/high-demand-course.repository";
import { HighDemanCourseDto } from "../dtos/high-demand-request.dto";



@Injectable()
export class HighDemanCourseImpl implements HighDemandCourseService {

  constructor(
    private readonly highDemanCourseRepository: HighDemandCourseRepository
  ) {}

  async saveHighDemandCourseRegistration(course: HighDemanCourseDto): Promise<any> {
    const saved = await this.highDemanCourseRepository.saveHighDemandCourse(course)
    return saved
  }
  changeHighDemandCourseQuota(quota: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

}