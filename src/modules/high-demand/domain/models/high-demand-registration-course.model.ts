import { HighDemandRegistrationCourseEntity } from "@high-demand/infrastructure/adapters/secondary/persistence/entities/high-demand-course.entity";

export class HighDemandRegistrationCourse {
  constructor(
    public readonly id: number,
    public readonly highDemandRegistrationId: number,
    public readonly levelId: number,
    public readonly gradeId: number,
    public readonly parallelId: number,
    public readonly totalQuota: number
  ) {}

  static create({
    id,
    highDemandRegistrationId,
    levelId,
    gradeId,
    parallelId,
    totalQuota
  }: {
    id: number,
    highDemandRegistrationId: number,
    levelId,
    gradeId,
    parallelId,
    totalQuota: number
  }): HighDemandRegistrationCourse {

    // Regla de negocio: No puede haber una inscripción de un curso de alta demanda con 0 plazas
    const registrationWithZeroPlaces = totalQuota <= 0;
    if(registrationWithZeroPlaces) {
      throw new Error('El cupo del curso seleccionado debe tener un valor distinto a 0')
    }


    return new HighDemandRegistrationCourse(
      id,
      highDemandRegistrationId,
      levelId,
      gradeId,
      parallelId,
      totalQuota
    )
  }

  static toDomain(course: HighDemandRegistrationCourseEntity): any {
    throw new Error("Method not implemented.");
  }
}