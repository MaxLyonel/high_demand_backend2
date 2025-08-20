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
      SELECT i.id, e.codigo_rude, e.nombre, e.paterno, e.materno
      FROM institucioneducativa i
      JOIN institucioneducativa_curso ic ON i.id = ic.institucioneducativa_id
      JOIN estudiante_inscripcion ei ON ic.id = ei.institucioneducativa_curso_id
      JOIN estudiante e ON e.id = ei.estudiante_id
      WHERE i.id = $1
      AND e.codigo_rude = $2
      --AND ic.gestion_tipo_id =

      `, [sie, codeRude]
    )
    return query[0]
  }
}