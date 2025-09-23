import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class TeacherRequestDto {
  @Type(() => Number)
  @IsInt()
  personId: number;

  @Type(() => Number)
  @IsInt()
  gestionId: number;
}