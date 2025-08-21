


export abstract class PreRegistrationRepository {
  abstract savePreRegistration(obj: any): Promise<any>;
  abstract getAllPreRegistration(): Promise<any>;
}