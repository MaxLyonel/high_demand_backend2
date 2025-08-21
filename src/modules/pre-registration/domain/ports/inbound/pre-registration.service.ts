


export abstract class PreRegistrationService {
  abstract savePreRegistration(obj: any): Promise<any>;
  abstract listPreRegistration(): Promise<any>;
}