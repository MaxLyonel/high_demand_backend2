import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum";
import { IsEnum, IsInt, IsString } from "class-validator";

export class CreateHistoryDto {

  @IsInt()
  highDemandRegistrationId: number

  @IsInt()
  userId: number

  @IsInt()
  workflowStateId: number

  @IsEnum(RegistrationStatus)
  registrationStatus: RegistrationStatus

  @IsString()
  observation: string | null
}