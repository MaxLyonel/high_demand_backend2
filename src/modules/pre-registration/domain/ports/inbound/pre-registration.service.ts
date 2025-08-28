


export abstract class PreRegistrationService {
  abstract savePreRegistration(obj: any): Promise<any>;
  abstract invalidatePreRegistration(obj: any): Promise<any>;
  abstract validatePreRegistration(obj: any): Promise<any>;
  abstract acceptPreRegistrations(obj: any): Promise<any>;

  abstract listPreRegistration(highDemandId: number): Promise<any>;
  abstract listValidPreRegistrations(highDemandId: number): Promise<any>;
  abstract lotterySelection(preRegistrationId: number): Promise<any>;
  abstract getPostulantsDrawn(): Promise<any>;
}