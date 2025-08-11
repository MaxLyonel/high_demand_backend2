import { IsInt, IsString } from "class-validator";


export class HighDemandCourseDtoReponse {

  @IsInt()
  levelId: number

  @IsString()
  levelName: string

  @IsInt()
  gradeId: number

  @IsString()
  gradeName: string

  @IsInt()
  parallelId: number

  @IsString()
  parallelName: string

  @IsInt()
  totalQuota: number
}