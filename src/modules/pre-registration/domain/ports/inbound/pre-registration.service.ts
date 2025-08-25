


export abstract class PreRegistrationService {
  abstract savePreRegistration(obj: any): Promise<any>;
  abstract listPreRegistration(): Promise<any>;
  abstract lotterySelection(preRegistrationId: number): Promise<any>;
  abstract getPostulantsDrawn(): Promise<any>;
}