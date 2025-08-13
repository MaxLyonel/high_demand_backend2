import { IsArray, IsInt, IsNotEmpty, ValidateNested } from "class-validator";
import { HighDemandDto } from "./high-demand-request.dto";
import { Type } from "class-transformer";

class HighDemandCourse {
  @IsInt()
  @IsNotEmpty()
  levelId: number;

  @IsInt()
  @IsNotEmpty()
  gradeId: number;

  @IsInt()
  @IsNotEmpty()
  parallelId: number;

  @IsInt()
  @IsNotEmpty()
  totalQuota: number;

}

export class CreateHighDemandDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => HighDemandDto)
  highDemand: HighDemandDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HighDemandCourse)
  courses: HighDemandCourse[];
}