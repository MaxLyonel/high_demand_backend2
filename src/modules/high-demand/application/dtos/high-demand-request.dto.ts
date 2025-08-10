import { IsEnum, IsInt } from "class-validator"

// export enum RegistrationStatus {
//   PENDING = 'PENDIENTE',
//   APPROVED = 'APROBADA',
//   OBSERVED = 'OBSERVADA',
//   REJECTED = 'RECHAZADA',
//   CANCELED = 'ANULADA',
// }

export class HighDemandDto {
  @IsInt()
  educationalInstitutionId: number

  @IsInt()
  userId: number
}