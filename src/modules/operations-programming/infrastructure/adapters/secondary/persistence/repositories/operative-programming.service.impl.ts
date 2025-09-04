import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Operative } from "src/modules/operations-programming/domain/models/operative.model";
import { OperationsProgrammingRepository } from "src/modules/operations-programming/domain/ports/outbound/operations-programming.repository";
import { OperativeEntity } from "../entities/operations-programming.entity";
import { Repository } from "typeorm";



@Injectable()
export class OperativeProgrammingRepositoryImpl implements OperationsProgrammingRepository {

  constructor(
    @InjectRepository(OperativeEntity, 'alta_demanda')
    private readonly operativeRepository: Repository<OperativeEntity>
  ){}

  async saveOperative(obj: any): Promise<OperativeEntity> {
    return await this.operativeRepository.save(obj);
  }

  async getOperative(gestionId: number): Promise<Operative | null> {
    const operative = await this.operativeRepository.findOne({
      where: {
        gestionId: gestionId
      }
    })
    if(!operative) return null
    return OperativeEntity.toDomain(operative!)
  }

}