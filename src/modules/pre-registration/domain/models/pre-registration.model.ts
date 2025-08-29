import { HighDemandRegistrationCourse } from "@high-demand/domain/models/high-demand-registration-course.model";
import { Representative } from "./representative.model";
import { Postulant } from "./postulant.model";
import { Criteria } from "./criteria.model";
import { PreRegistrationStatus } from "../enums/pre-registration-status.enum";


export class PreRegistration {
  constructor(
    public readonly id: number,
    public readonly highDemandCourseId: HighDemandRegistrationCourse,
    public readonly representativeId: Representative,
    public readonly postulantId: Postulant,
    public readonly criteriaId: Criteria,
    public readonly state: PreRegistrationStatus
  ) {}


  static create({
    id,
    highDemandCourseId,
    representativeId,
    postulantId,
    criteriaId,
    state,
    existingPreRegistration
  }: {
    id: number,
    highDemandCourseId: HighDemandRegistrationCourse,
    representativeId: Representative,
    postulantId: Postulant,
    criteriaId: Criteria,
    state: PreRegistrationStatus,
    existingPreRegistration: PreRegistration[]
  }): PreRegistration {
    // Regla de negocio: no puede haber pre inscripciones con id de curso duplicado
    const alreadyExists = existingPreRegistration.some(c => c.highDemandCourseId.id === highDemandCourseId.id && c.postulantId.id === postulantId.id)
    if(alreadyExists) {
      throw new Error('Ya existe una pre inscripción a este curso con este postulante')
    }


    return new PreRegistration(id, highDemandCourseId, representativeId, postulantId, criteriaId, state)
  }
}