// framework nestjs
import { Injectable } from "@nestjs/common";
// external dependencies
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
// own implementations
import { EducationalInstitutionEntity } from "../entities/educational-institution.entity";
import { EducationalInstitutionRepository } from "@high-demand/domain/ports/outbound/educational-institution.repository"
import { mapToDto } from "@high-demand/application/mappers/educational-institution.dto";
import { EducationalInstitutionDto } from "@high-demand/application/dtos/educational-institution-info-response.dto";
import { EducationalInstitution } from "@high-demand/domain/models/educational-institution.model";




@Injectable()
export class EducationalInstitutionRepositoryImpl implements EducationalInstitutionRepository {
  constructor(
    @InjectRepository(EducationalInstitutionEntity, 'alta_demanda')
    private readonly educationalInstitutionRepository: Repository<EducationalInstitutionEntity>
  ) {}

  async findBySie(id: number): Promise<EducationalInstitutionDto | null> {

    const result = await this.educationalInstitutionRepository.query(`
      SELECT
        i.id AS id,
        i.institucioneducativa AS name,
        it.descripcion AS scope,
        dt.dependencia AS dependency,
        jg.direccion AS direction,
        et.estadoinstitucion AS state,
        distrito.lugar AS district,
        departamento.lugar AS department
      FROM institucioneducativa i
      INNER JOIN institucioneducativa_tipo it on it.id = i.institucioneducativa_tipo_id
      INNER JOIN estadoinstitucion_tipo et on et.id = i.estadoinstitucion_tipo_id
      INNER JOIN jurisdiccion_geografica jg on i.le_juridicciongeografica_id = jg.id
      INNER JOIN lugar_tipo distrito ON distrito.id = jg.lugar_tipo_id_distrito
      INNER JOIN lugar_tipo departamento ON departamento.id = distrito.lugar_tipo_id
      INNER JOIN dependencia_tipo dt on dt.id = i.dependencia_tipo_id
      WHERE i.id = $1
    `, [id]);

    const row = result?.[0]
    if(!row) return null

    return mapToDto(row)

  }

  async searchEducationalInstitutionDistrict(id: number): Promise<any> {
    const institution  = await this.educationalInstitutionRepository.findOne({
      where: {
        id: id
      },
      relations: ['jurisdiction', 'jurisdiction.districtPlaceType', 'state', 'educationalInstitutionType']
    })
    if(!institution) throw new Error('No se encontro a la institución');
    return EducationalInstitutionEntity.toDomain(institution)
  }
}