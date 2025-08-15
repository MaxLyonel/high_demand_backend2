import { IsEnum, IsInt, IsNotEmpty } from "class-validator"

export class HighDemandDto {
  @IsInt()
  @IsNotEmpty()
  educationalInstitutionId: number

  @IsInt()
  @IsNotEmpty()
  userId: number

  @IsInt()
  rolId: number;
}