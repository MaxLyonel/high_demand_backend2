import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OperatorEnum } from '../enums/operator.enum';



export class Condition {
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

export class Action {
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

export class Resource {
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

export class Rol {
  @IsNumber()
  @Type(() => Number)
  id: number;

  @IsString()
  name: string;

  // Aquí podría crear otro DTO para validar rolPermissions
  @IsOptional()
  rolPermissions?: any[];
}

export class ManagePermission {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @ValidateNested()
  @Type(() => Rol)
  rol: Rol;

  @ValidateNested()
  @Type(() => Action)
  action: Action;

  @ValidateNested()
  @Type(() => Resource)
  subject: Resource;

  @IsBoolean()
  active: boolean;

  @IsString()
  description: string;

  @ValidateNested({ each: true })
  @Type(() => Condition)
  conditions: Condition[];

  @IsOptional()
  @IsString()
  __typename?: string;
}


