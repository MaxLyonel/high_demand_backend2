import { RegistrationStatus } from "../enums/registration-status.enum";


export class History {
  constructor(
    public id: number,
    public highDemandRegistrationId: number,
    public educationalInstitutionId: number,
    public educationalInstitutionName: string,
    public userName: string,
    public rol: string,
    public workflowState: string,
    public registrationStatus: RegistrationStatus,
    public observation: string | null,
    public createdAt?: Date,      // agregar opcional o obligatorio según convenga
    public updatedAt?: Date
  ) { }
}