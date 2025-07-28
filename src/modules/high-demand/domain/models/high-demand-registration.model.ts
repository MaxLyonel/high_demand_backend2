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
    operativeId
  }: {
    id: number,
    educationalInstitutionId: number,
    userId: number,
    currentWorkflowState: string,
    workflowId: number,
    registrationStatus: RegistrationStatus,
    inbox: boolean,
    operativeId: number
  }): HighDemandRegistration {
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