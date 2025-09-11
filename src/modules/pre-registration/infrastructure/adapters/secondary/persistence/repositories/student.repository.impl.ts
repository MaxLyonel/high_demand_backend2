import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StudentRepository } from "@pre-registration/domain/ports/outbound/student.repository";
import { StudentEntity } from "../entities/student.entity";
import { Repository } from "typeorm";


@Injectable()
export class StudentRepositoryImpl implements StudentRepository {

  constructor(
    @InjectRepository(StudentEntity, 'alta_demanda')
    private readonly _studentRepository: Repository<StudentEntity>
  ) {}

  async searchByRUDE(sie: number, codeRude: string): Promise<any> {
    const query = await this._studentRepository.query(
      `
      SELECT i.id, e.codigo_rude, e.nombre, e.paterno, e.materno, nt.id, nt.nivel, gt.id, gt.grado, pt.id, pt.paralelo
      FROM institucioneducativa i
      JOIN institucioneducativa_curso ic ON i.id = ic.institucioneducativa_id
      JOIN estudiante_inscripcion ei ON ic.id = ei.institucioneducativa_curso_id
      JOIN estudiante e ON e.id = ei.estudiante_id
      JOIN nivel_tipo nt ON ic.nivel_tipo_id = nt.id
      JOIN grado_tipo gt ON ic.grado_tipo_id = gt.id
      JOIN paralelo_tipo pt ON ic.paralelo_tipo_id = pt.id
      WHERE i.id = $1
      AND e.codigo_rude = $2
      --AND ic.gestion_tipo_id = 2025

      `, [sie, codeRude]
    )
    return query[0]
  }
}