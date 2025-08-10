import { IsArray, IsInt, ValidateNested } from "class-validator"
import { HighDemandDto } from "./high-demand-request.dto"
import { Type } from "class-transformer";

class LevelGradeParallel {
  @IsInt()
  levelId: number;

  @IsInt()
  gradeId: number;

  @IsInt()
  parallelId: number;

  @IsInt()
  totalQuota: number
}

export class HighDemandCourseDto {

  @ValidateNested()
  @Type(() => HighDemandDto)
  highDemand: HighDemandDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LevelGradeParallel)
  courses: LevelGradeParallel[];

}