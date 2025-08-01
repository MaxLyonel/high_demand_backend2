import { HighDemandRegistrationCourse } from '@high-demand/domain/models/high-demand-registration-course.model'


export abstract class HighDemandCourseRepository {
  abstract findById(id: number): Promise<HighDemandRegistrationCourse>;
  abstract findByHighDemandRegistrationId(highDemandRegistrationId: number): Promise<HighDemandRegistrationCourse>;
  abstract saveHighDemandCourse(obj: any): Promise<HighDemandRegistrationCourse>;
}