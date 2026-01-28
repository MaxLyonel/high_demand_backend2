


export abstract class PreRegistrationService {
  abstract savePreRegistration(obj: any): Promise<any>;
  abstract updatePreRegistration(obj: any): Promise<any>;
  abstract invalidatePreRegistration(obj: any): Promise<any>;
  abstract validatePreRegistration(obj: any): Promise<any>;
  abstract acceptPreRegistrations(obj: any): Promise<any>;

  abstract listPreRegistration(highDemandId: number): Promise<any>;
  abstract listValidPreRegistrations(highDemandId: number, levelId: number, gradeId: number): Promise<any>;
  abstract listPreRegistrationFollow(identityCardPostulant: string): Promise<any>;

  abstract lotterySelection(preRegistrationId: number): Promise<any>;
  abstract getPostulantsDrawn(): Promise<any>;

  abstract obtainPreRegistrationInformation(preRegistrationId: number): Promise<any>;
  abstract getPreRegistration(postulantId: number): Promise<any>

  abstract getCounts(courseId: number): Promise<number>;
}