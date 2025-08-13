import { IsEnum, IsInt, IsNotEmpty } from "class-validator"

// export enum RegistrationStatus {
//   PENDING = 'PENDIENTE',
//   APPROVED = 'APROBADA',
//   OBSERVED = 'OBSERVADA',
//   REJECTED = 'RECHAZADA',
//   CANCELED = 'ANULADA',
// }

export class HighDemandDto {
  @IsInt()
  @IsNotEmpty()
  educationalInstitutionId: number

  @IsInt()
  @IsNotEmpty()
  userId: number
}