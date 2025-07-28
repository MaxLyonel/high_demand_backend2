




export class HighDemandRegistrationCourse {
  constructor(
    public readonly id: number,
    public readonly highDemandRegistrationId: number,
    public readonly educationalInstitutionCourseId: number,
    public readonly totalQuota: number
  ) {}

  static create({
    id,
    highDemandRegistrationId,
    educationalInstitutionCourseId,
    totalQuota
  }: {
    id: number,
    highDemandRegistrationId: number,
    educationalInstitutionCourseId: number,
    totalQuota: number
  }): HighDemandRegistrationCourse {
    return new HighDemandRegistrationCourse(
      id,
      highDemandRegistrationId,
      educationalInstitutionCourseId,
      totalQuota
    )
  }
}