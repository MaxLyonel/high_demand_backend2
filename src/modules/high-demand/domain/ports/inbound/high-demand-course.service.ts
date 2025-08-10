import { HighDemandRegistrationCourse } from "@high-demand/domain/models/high-demand-registration-course.model";

export abstract class HighDemandCourseService {
  abstract saveHighDemandCourseRegistration(objInstitution: any): Promise<any>;
  abstract changeHighDemandCourseQuota(courseId: number, quota: number): Promise<any>;
  abstract deleteCourse(courseId: number): Promise<HighDemandRegistrationCourse>;
}