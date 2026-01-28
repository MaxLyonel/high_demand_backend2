import { InjectRepository } from '@nestjs/typeorm';
import { EducationalInstitutionConsolidationRepository, } from '../../../../../domain/ports/outbound/educational-institution-consolidation.repository';
import { EducationalInstitutionConsolidateEntity } from '../entities/educational-institution-consolidate.entity';
import { Repository } from 'typeorm';
import { OperativeEntity } from 'src/modules/operations-programming/infrastructure/adapters/secondary/persistence/entities/operations-programming.entity';
import { Inject, Injectable } from '@nestjs/common';




@Injectable()
export class EducationalInstitutionConsolidationRepositoryImpl implements EducationalInstitutionConsolidationRepository {
  constructor(
    @InjectRepository(EducationalInstitutionConsolidateEntity, 'alta_demanda')
    private readonly educationalInstitutionConsolidate: Repository<EducationalInstitutionConsolidateEntity>,
    @InjectRepository(OperativeEntity, 'alta_demanda')
    private readonly operativeRepository: Repository<OperativeEntity>,
    @Inject('APP_CONSTANTS') private readonly constants,
  ) {}

  async consolidate(sie: number): Promise<boolean> {
    const currentOperation = await this.operativeRepository.findOne({
      where: {
        isActive: true,
        gestionId: this.constants.CURRENT_YEAR
      }
    })
    if(!currentOperation) throw new Error("No hay un operativo activo para la gestion actual");

    const existing = await this.educationalInstitutionConsolidate.findOne(
      {
        where: {
          educationalInstitution: { id: sie },
          operative: { id: currentOperation.id }
        }
      }
    )
    if(existing?.consolidate) throw new Error("La institución educativa ya se encuentra consolidada");

    if(existing) {
      existing.consolidate = true;
      existing.consolidateDate = new Date();
      await this.educationalInstitutionConsolidate.save(existing);
      return true;
    }

    await this.educationalInstitutionConsolidate.save({
      educationalInstitution: { id: sie },
      operative: { id: currentOperation.id},
      consolidate: true,
      consolidateDate: new Date()
    })
    return true;

  }

  async check(sie: number): Promise<boolean> {
    const currentOperation = await this.operativeRepository.findOne({
      where: {
        isActive: true,
        gestionId: this.constants.CURRENT_YEAR
      }
    })
    if(!currentOperation) throw new Error("No hay un operativo activo para la gestion actual");

    const existing = await this.educationalInstitutionConsolidate.findOne({
      where: {
        educationalInstitution: { id: sie },
        operative: { id: currentOperation.id },
        consolidate: true
      }
    })
    return existing?.consolidate ?? false;
  }
}