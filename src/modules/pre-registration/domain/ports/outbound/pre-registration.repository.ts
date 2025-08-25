


export abstract class PreRegistrationRepository {
  abstract savePreRegistration(obj: any): Promise<any>;
  abstract getAllPreRegistration(): Promise<any>;
  abstract updateStatus(preRegistrationId: number): Promise<any>;
  abstract getApplicantsAcceptedStatus(): Promise<any>;
}