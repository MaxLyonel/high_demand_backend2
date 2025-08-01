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

    // Regla de negocio: No puede haber una inscripción de un curso de alta demanda con 0 plazas
    const registrationWithZeroPlaces = totalQuota <= 0;
    if(registrationWithZeroPlaces) {
      throw new Error('El nivel y grado seleccionado debe contener por lo menos un cupo')
    }


    return new HighDemandRegistrationCourse(
      id,
      highDemandRegistrationId,
      educationalInstitutionCourseId,
      totalQuota
    )
  }
}