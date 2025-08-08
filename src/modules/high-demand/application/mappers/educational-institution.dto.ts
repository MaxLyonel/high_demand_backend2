import { EducationalInstitutionDto } from "../dtos/educational-institution-info-response.dto";

export function mapToDto(row: any): EducationalInstitutionDto {
  return {
    id: row.id,
    name: row.name,
    state: row.state,
    scope: row.scope,
    dependency: row.dependency,
    direction: row.direction
  };
}