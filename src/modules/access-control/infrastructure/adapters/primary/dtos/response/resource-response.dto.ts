import { Resource } from "@access-control/domain/models/permission.model";
import { BaseResponseDto } from "./base-response.dto";


export class ResourceResponseDto extends BaseResponseDto<Resource[]> {}