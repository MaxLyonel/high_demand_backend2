import { Action } from "@access-control/domain/models/permission.model";
import { BaseResponseDto } from "./base-response.dto";



export class ActionResponseDto extends BaseResponseDto<Action[]>{}