import { OperatorEnum } from '@access-control/domain/enums/operator.enum';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';



export class ConditionDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsString()
  field: string;

  @IsEnum(OperatorEnum)
  operator: OperatorEnum;

  @IsString()
  value: string;
}

export class ActionDto {
  @IsNumber()
  @Type(() => Number)
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsString()
  __typename?: string;
}

export class ResourceDto {
  @IsNumber()
  @Type(() => Number)
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsString()
  __typename?: string;
}

export class RolDto {
  @IsNumber()
  @Type(() => Number)
  id: number;

  @IsString()
  name: string;

  // Aquí podría crear otro DTO para validar rolPermissions
  @IsOptional()
  rolPermissions?: any[];
}

export class ManagePermissionRequestDto {

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @ValidateNested()
  @Type(() => RolDto)
  rol: RolDto;

  @ValidateNested()
  @Type(() => ActionDto)
  action: ActionDto;

  @ValidateNested()
  @Type(() => ResourceDto)
  subject: ResourceDto;

  @IsBoolean()
  active: boolean;

  @IsString()
  description: string;

  @ValidateNested({ each: true })
  @Type(() => ConditionDto)
  conditions: ConditionDto[];

  @IsOptional()
  @IsString()
  __typename?: string;
}


