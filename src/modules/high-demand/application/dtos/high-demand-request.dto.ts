import { IsInt } from "class-validator"


export class HighDemanCourseDto {

  @IsInt()
  levelId: number

  @IsInt()
  gradeId: number

  @IsInt()
  parallelId: number

  @IsInt()
  quotas: number

}