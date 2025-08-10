import { HighDemandRegistrationCourse } from '@high-demand/domain/models/high-demand-registration-course.model'


export abstract class HighDemandCourseRepository {
  abstract findById(id: number): Promise<HighDemandRegistrationCourse>;
  abstract findByHighDemandRegistrationId(highDemandRegistrationId: number): Promise<HighDemandRegistrationCourse>;
  abstract saveHighDemandCourse(highDemandRegistrationId: number, obj: Array<Omit<HighDemandRegistrationCourse, 'id' | 'highDemandRegistrationId'>>): Promise<HighDemandRegistrationCourse[]>;
  abstract modifyQuota(highDemandCourseId: number, newQuota: number): Promise<HighDemandRegistrationCourse>;
  abstract deleteCourse(highDemandCourseId: number): Promise<HighDemandRegistrationCourse>;
}