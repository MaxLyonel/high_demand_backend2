import { Permission } from "@access-control/domain/models/permission.model";
import { BaseResponseDto } from "./base-response.dto";



export class PermissionsResponseDto extends BaseResponseDto<Permission[]> {}