export abstract class HighDemandCourseService {
  abstract saveHighDemandCourseRegistration(course: any): Promise<any>;
  abstract changeHighDemandCourseQuota(quota: number): Promise<boolean>;
}