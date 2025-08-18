import { HighDemandRegistrationCourseEntity } from "@high-demand/infrastructure/adapters/secondary/persistence/entities/high-demand-course.entity";

export class HighDemandRegistrationCourse {
  constructor(
    public readonly id: number | null,
    public readonly highDemandRegistrationId: number,
    public readonly levelId: number,
    public readonly gradeId: number,
    public readonly parallelId: number,
    public readonly totalQuota: number,
  ) {}

  static create({
    id,
    highDemandRegistrationId,
    levelId,
    gradeId,
    parallelId,
    totalQuota,
    existingCourses
  }: {
    id: number | null,
    highDemandRegistrationId: number,
    levelId: number,
    gradeId: number,
    parallelId: number,
    totalQuota: number,
    existingCourses: HighDemandRegistrationCourse[]
  }): HighDemandRegistrationCourse {

    // Regla de negocio: No puede haber una inscripción de un curso de alta demanda con 0 plazas
    const registrationWithZeroPlaces = totalQuota <= 0;
    if(registrationWithZeroPlaces) {
      throw new Error('El cupo del curso seleccionado debe tener un valor distinto a 0')
    }

    // Regla: No puede haber cursos duplicados en la misma inscripción
    const alreadyExists = existingCourses.some(c =>
      c.highDemandRegistrationId === highDemandRegistrationId &&
      c.levelId === levelId &&
      c.gradeId === gradeId &&
      c.parallelId === parallelId
    );

    if (alreadyExists) {
      throw new Error('Ya existe un curso con el mismo nivel, grado y paralelo para esta inscripción');
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