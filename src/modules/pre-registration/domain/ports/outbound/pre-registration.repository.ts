


export abstract class PreRegistrationRepository {
  abstract savePreRegistration(obj: any): Promise<any>;
  abstract updatePreRegistration(obj: any): Promise<any>;
  abstract invalidatePreRegistration(obj: any): Promise<any>;
  abstract validatePreRegistration(obj: any): Promise<any>;
  abstract acceptPreRegistrations(obj: any): Promise<any>;

  abstract getAllPreRegistration(highDemandId: number): Promise<any>;
  abstract getValidPreRegistrations(highDemandId: number, levelId: number, gradeId: number): Promise<any>;
  abstract getPreRegistrationFollow(identityCardPostulant: string): Promise<any>;

  abstract updateStatus(preRegistrationId: number): Promise<any>;
  abstract getApplicantsAcceptedStatus(): Promise<any>;

  abstract getPreRegistrationInfo(preRegistrationId: number): Promise<any>;
  abstract getCounts(courseId: number): Promise<any>;
  abstract getPreRegistrations(sie: number): Promise<any>;
}