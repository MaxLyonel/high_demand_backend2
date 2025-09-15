import { BaseResponseDto } from "./base-response.dto";
import { RolPermission } from "@access-control/domain/models/rol-permission.model";


export class CreatePermissionResponseDto extends BaseResponseDto<RolPermission>{}