import { Teacher } from '@access-control/domain/models/teacher.model';
import { BaseResponseDto } from './base-response.dto';


export class TeacherResponseDto extends BaseResponseDto<Teacher | null> {}