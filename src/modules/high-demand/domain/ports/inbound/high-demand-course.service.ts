export abstract class HighDemandCourseService {
  abstract saveHighDemandCourseRegistration(objInstitution: any): Promise<any>;
  abstract changeHighDemandCourseQuota(quota: number): Promise<boolean>;
}