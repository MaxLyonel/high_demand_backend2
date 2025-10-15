import { HistoryRepository } from "@high-demand/domain/ports/outbound/history.repository";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HistoryEntity } from "../entities/history.entity";
import { History } from "@high-demand/domain/models/history.model";
import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto";
import { OperativeEntity } from "src/modules/operations-programming/infrastructure/adapters/secondary/persistence/entities/operations-programming.entity";


@Injectable()
export class HistoryRepositoryImpl implements HistoryRepository {

  constructor(
    @Inject('APP_CONSTANTS') private readonly constants,
    @InjectRepository(HistoryEntity, 'alta_demanda') private _historyRepository: Repository<HistoryEntity>,
    @InjectRepository(OperativeEntity, 'alta_demanda') private readonly operativeRepository: Repository<OperativeEntity>
  ) {}

  async updatedHistory(obj: CreateHistoryDto): Promise<any> {
    const updatedHistory = await this._historyRepository.insert(obj)
    if(updatedHistory.identifiers.length <= 0) throw new Error("No se pudo actualizar el historial");
    return updatedHistory
  }

  async getHistory(highDemandRegistrationId: number): Promise<History[]> {
    const histories = await this._historyRepository.find({
      where: {
        highDemandRegistration: { id: highDemandRegistrationId }
      },
      withDeleted: true,
      relations: ['highDemandRegistration.educationalInstitution', 'user', 'workflowState', 'rol']
    });

    return histories.map(entity => {
      return new History(
        entity.id,
        entity.highDemandRegistration.id,
        entity.highDemandRegistration.educationalInstitution?.id,
        entity.highDemandRegistration.educationalInstitution?.name,
        entity.userId,
        entity.user.username,
        entity.rol.name,
        entity.rol.id,
        entity.workflowState.name,
        entity.registrationStatus,
        entity.observation,
        entity.createdAt,
        entity.updatedAt
      );
    });
  }

  async getHistories(): Promise<History[]> {
    const histories = await this._historyRepository.find({
      withDeleted: true,
      relations: ['highDemandRegistration.educationalInstitution', 'user', 'workflowState', 'rol'],
      order: {
        id: 'DESC'
      }
    })
    return histories.map(entity => {
      return new History(
        entity.id,
        entity.highDemandRegistration.id,
        entity.highDemandRegistration.educationalInstitution?.id,
        entity.highDemandRegistration.educationalInstitution?.name,
        entity.userId,
        entity.user.username,
        entity.rol.name,
        entity.rol.id,
        entity.workflowState.name,
        entity.registrationStatus,
        entity.observation,
        entity.createdAt,
        entity.updatedAt
      )
    })
  }

  async getHighDemands(districtId: number): Promise<any[]> {
    const { CURRENT_YEAR } = this.constants
    const operative = await this.operativeRepository.findOne({
      where: { gestionId: CURRENT_YEAR },
      select: { id: true }
    })
    if(!operative) throw new Error("Periódos no definidos. Por favor contáctese con el administrador");
    const highDemands = await this._historyRepository.find({
      where: {
        workflowStateId: 2, // EN REVISION
        rolId: 37, // ROL DISTRITAL
        highDemandRegistration: {
          operativeId: operative.id,
          educationalInstitution: {
            jurisdiction: {
              districtPlaceType: {
                id: districtId
              }
            }
          }
        }
      },
      relations: [
        'highDemandRegistration',
        'highDemandRegistration.courses',
        'highDemandRegistration.courses.level',
        'highDemandRegistration.courses.grade',
        'highDemandRegistration.courses.parallel',
        'highDemandRegistration.educationalInstitution',
        'highDemandRegistration.educationalInstitution.dependencyType',
        'highDemandRegistration.educationalInstitution.jurisdiction',
        'highDemandRegistration.educationalInstitution.jurisdiction.districtPlaceType',
        'highDemandRegistration.educationalInstitution.jurisdiction.localityPlaceType',
        'highDemandRegistration.educationalInstitution.jurisdiction.localityPlaceType.parent',
        'highDemandRegistration.educationalInstitution.jurisdiction.localityPlaceType.parent.parent',
        'highDemandRegistration.educationalInstitution.jurisdiction.localityPlaceType.parent.parent.parent',
        'highDemandRegistration.educationalInstitution.jurisdiction.localityPlaceType.parent.parent.parent.parent',
      ]
    })
    const histories:any = []
    for(let history of highDemands) {
      const newObj:any = {}
      newObj.district = history?.highDemandRegistration?.educationalInstitution?.jurisdiction?.districtPlaceType?.place
      newObj.department = history?.highDemandRegistration?.educationalInstitution?.jurisdiction?.localityPlaceType?.parent?.parent?.parent?.parent?.place
      newObj.institution = {
        name: history?.highDemandRegistration?.educationalInstitution?.name,
        rude: history?.highDemandRegistration?.educationalInstitution?.id,
        dependency: history?.highDemandRegistration?.educationalInstitution?.dependencyType?.dependency
      }
      const courses:any = []
      for(let course of history?.highDemandRegistration?.courses) {
        const newObjCourses: any = {}
        newObjCourses.nivel = course?.level?.name,
        newObjCourses.grade = course?.grade?.name,
        newObjCourses.parallel = course?.parallel?.name
        newObjCourses.totalQuota = course?.totalQuota

        courses.push(newObjCourses)
      }
      newObj.courses = courses
      histories.push(newObj)
    }
    return histories
  }
}