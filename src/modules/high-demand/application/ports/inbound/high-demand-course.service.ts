


export abstract class HighDemandCourseService {
  abstract saveHighDemandCourseRegistration(course: any, quotas: number): Promise<any>;
  abstract changeHighDemandCourseQuota(quota: number): Promise<boolean>;
}