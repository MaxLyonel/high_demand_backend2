import { RegistrationStatus } from "../enums/registration-status.enum"




export class HighDemandRegistration {
  constructor(
    public readonly id: number,
    public readonly educationalInstitutionId: number,
    public readonly userId: number,
    public readonly currentWorkflowState: string, // manejar bandeja
    public readonly workflowId: number, // lfujo que sigue
    public readonly registrationStatus: RegistrationStatus,
    public readonly inbox: boolean, // esta en su bandeja?
    public readonly operativeId: number
  ) {}

  static create({
    id,
    educationalInstitutionId,
    userId,
    currentWorkflowState,
    workflowId,
    registrationStatus,
    inbox,
    operativeId,
    existingRegistrations
  }: {
    id: number,
    educationalInstitutionId: number,
    userId: number,
    currentWorkflowState: string,
    workflowId: number,
    registrationStatus: RegistrationStatus,
    inbox: boolean,
    operativeId: number,
    existingRegistrations: HighDemandRegistration[]
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
      currentWorkflowState,
      workflowId,
      registrationStatus,
      inbox,
      operativeId
    )
  }
}