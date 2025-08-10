export abstract class HighDemandCourseService {
  abstract saveHighDemandCourseRegistration(objInstitution: any): Promise<any>;
  abstract changeHighDemandCourseQuota(courseId: number, quota: number): Promise<boolean>;
}