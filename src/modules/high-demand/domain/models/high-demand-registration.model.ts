import { RegistrationStatus } from "../enums/registration-status.enum"
import { HighDemandRegistrationCourse } from "./high-demand-registration-course.model";


export class HighDemandRegistration {
  constructor(
    public readonly id: number,
    public readonly educationalInstitutionId: number,
    public readonly userId: number,
    public workflowStateId: number, // manejar bandeja
    public workflowId: number, // lfujo que sigue
    public registrationStatus: RegistrationStatus,
    public inbox: boolean, // esta en su bandeja?
    public operativeId: number,
    public rolId: number,
    public courses: HighDemandRegistrationCourse[] // Tiene varios cursos asignados
  ) {}

  static create({
    id,
    educationalInstitutionId,
    userId,
    workflowStateId,
    workflowId,
    registrationStatus,
    inbox,
    operativeId,
    rolId,
    existingRegistrations,
    courses
  }: {
    id: number,
    educationalInstitutionId: number,
    userId: number,
    workflowStateId: number,
    workflowId: number,
    registrationStatus: RegistrationStatus,
    inbox: boolean,
    operativeId: number,
    rolId: number,
    existingRegistrations: HighDemandRegistration[],
    courses: HighDemandRegistrationCourse[]
  }): HighDemandRegistration {

    // Regla negocio: Una unidad educativa no puede estar doblemente registrada en una misma gestión
    const alreadyRegistered = existingRegistrations.some(
      (reg) => reg.educationalInstitutionId === educationalInstitutionId && reg.operativeId === operativeId
    );

    if(alreadyRegistered) {
      throw new Error('La unidad educativa ya está registrada como alta demanda en esta gestión')
    }


    return new HighDemandRegistration(
      id,
      educationalInstitutionId,
      userId,
      workflowStateId,
      workflowId,
      registrationStatus,
      inbox,
      operativeId,
      rolId,
      courses
    )
  }
}