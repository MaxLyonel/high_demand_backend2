import { Rol } from "@access-control/domain/models/rol.model";
import { BaseResponseDto } from "./base-response.dto";


export class RolesResponseDto extends BaseResponseDto<Rol[]> {}