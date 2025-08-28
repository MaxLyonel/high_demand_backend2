import { PreRegistrationStatus } from "../enums/pre-registration-status.enum";



export class HistoryPreRegistration {
  constructor(
    public id: number,
    public preRegistrationId: number,
    public userId: number,
    public rolId: number,
    public state: PreRegistrationStatus,
    public observation: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}