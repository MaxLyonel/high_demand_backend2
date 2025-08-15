import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum";
import { IsBoolean, IsEnum, IsInt, IsNotEmpty } from "class-validator";



export class RegisterHighDemandDto {
  @IsInt()
  @IsNotEmpty()
  id: number

  @IsInt()
  @IsNotEmpty()
  educationalInstitutionId: number

  @IsInt()
  @IsNotEmpty()
  userId: number

  @IsInt()
  @IsNotEmpty()
  workflowStateId: number

  @IsInt()
  @IsNotEmpty()
  workflowId: number

  @IsEnum(RegistrationStatus)
  @IsNotEmpty()
  registrationStatus: RegistrationStatus

  @IsBoolean()
  @IsNotEmpty()
  inbox: boolean

  @IsInt()
  @IsNotEmpty()
  operativeId: number

  @IsInt()
  @IsNotEmpty()
  rolId: number
}