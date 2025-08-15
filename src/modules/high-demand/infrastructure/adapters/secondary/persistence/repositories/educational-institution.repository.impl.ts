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

  // async findById(id: number): Promise<EducationalInstitution> {
  //   const institution = await this.educationalInstitutionRepository.findOne({
  //     where: {
  //       id: id
  //     }
  //   })
  //   if(!institution) throw new Error('Error al obtener la institución')
  //   return EducationalInstitution.toDomain(institution)
  // }

  async findBySie(id: number): Promise<EducationalInstitutionDto | null> {

    const result = await this.educationalInstitutionRepository.query(`
      SELECT
        i.id AS id,
        i.institucioneducativa AS name,
        it.descripcion AS scope,
        dt.dependencia AS dependencie,
        jg.direccion AS direction,
        et.estadoinstitucion AS state
      FROM institucioneducativa i
      INNER JOIN institucioneducativa_tipo it on it.id = i.institucioneducativa_tipo_id
      INNER JOIN estadoinstitucion_tipo et on et.id = i.estadoinstitucion_tipo_id
      INNER JOIN jurisdiccion_geografica jg on i.le_juridicciongeografica_id = jg.id
      INNER JOIN dependencia_tipo dt on dt.id = i.dependencia_tipo_id
      WHERE i.id = $1
    `, [id]);

    const row = result?.[0]
    if(!row) return null

    return mapToDto(row)

    // const educationalInstitutinEntity = await this.educationalInstitutionRepository.findOne({ where: { id }})
    // if(!educationalInstitutinEntity) return null
    // return EducationalInstitutionEntity.toDomain(educationalInstituionEntity)
  }
}