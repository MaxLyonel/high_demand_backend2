import { HighDemandRegistrationCourse } from "src/modules/high-demand/domain/models/high-demand-registration-course.model";





export abstract class HighDemandCourseRepository {
  abstract findById(id: number): Promise<HighDemandRegistrationCourse>;
  abstract findByHighDemandRegistrationId(highDemandRegistrationId: number): Promise<HighDemandRegistrationCourse>;
}