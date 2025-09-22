// framework nestjs
import { Inject, Injectable } from '@nestjs/common';
// external independencies
import { DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// own implementations
import { HighDemandRepository } from '@high-demand/domain/ports/outbound/high-demand.repository';
import { HighDemandRegistration } from '@high-demand/domain/models/high-demand-registration.model';
import { HighDemandRegistrationEntity } from '../entities/high-demand.entity';
import { RegistrationStatus } from '@high-demand/domain/enums/registration-status.enum';
import { HistoryRepository } from '@high-demand/domain/ports/outbound/history.repository';
import { CreateHistoryDto } from '@high-demand/application/dtos/create-history.dto';
import { HighDemandRegistrationCourseEntity } from '../entities/high-demand-course.entity';
import { HighDemandRegistrationCourse } from '@high-demand/domain/models/high-demand-registration-course.model';
import { PlaceTypeEntity } from '../entities/place-type.entity';

interface Course {
  id: number;
  highDemandRegistrationId: number;
  levelId: number;
  gradeId: number;
  parallelId: number;
  totalQuota: number;
}

interface NewHighDemandRegistration {
  id: number;
  educationalInstitutionId: number;
  userId: number;
  workflowStateId: number;
  workflowId: number;
  registrationStatus: RegistrationStatus;
  inbox: boolean;
  operativeId: number;
  rolId: number;
  placeDistrict: any;
  courses: Course[];
}

@Injectable()
export class HighDemandRepositoryImpl implements HighDemandRepository {
  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    @InjectRepository(HighDemandRegistrationEntity, 'alta_demanda')
    private readonly highDemandRepository: Repository<HighDemandRegistrationEntity>,
    @InjectRepository(HighDemandRegistrationCourseEntity, 'alta_demanda')
    private readonly highDemandCourseRepository: Repository<HighDemandRegistrationCourseEntity>,
    @InjectRepository(PlaceTypeEntity, 'alta_demanda')
    private readonly placeTypeRepository: Repository<PlaceTypeEntity>,
    private readonly _history: HistoryRepository,
  ) {}

  // ** guarda la alta demanda **
  async saveHighDemandRegistration(
    obj: HighDemandRegistration,
  ): Promise<HighDemandRegistration> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Guardar la entidad principal sin los cursos aún
      const { courses } = obj;
      const highDemandToSave = { ...obj, courses: undefined };
      const newHighDemand: any = await queryRunner.manager.save(
        this.highDemandRepository.target,
        highDemandToSave,
      );

      // 2. Traer cursos existentes persistidos para esta inscripción
      const existingCourses = await queryRunner.manager.find(
        this.highDemandCourseRepository.target,
        {
          where: { highDemandRegistrationId: newHighDemand.id },
        },
      );

      // 3. Crear y validar cursos en el dominio
      for (const course of courses) {
        const domainCourse = HighDemandRegistrationCourse.create({
          id: null,
          highDemandRegistrationId: newHighDemand.id,
          levelId: course.levelId,
          gradeId: course.gradeId,
          parallelId: course.parallelId,
          totalQuota: course.totalQuota,
          existingCourses: existingCourses.map(
            (c) =>
              ({
                levelId: c.levelId,
                gradeId: c.gradeId,
                parallelId: c.parallelId,
              }) as any,
          ),
        });

        const entityCourse = this.highDemandCourseRepository.create({
          highDemandRegistrationId: domainCourse.highDemandRegistrationId,
          levelId: domainCourse.levelId,
          gradeId: domainCourse.gradeId,
          parallelId: domainCourse.parallelId,
          totalQuota: domainCourse.totalQuota,
        });

        const savedCourse = await queryRunner.manager.save(
          this.highDemandCourseRepository.target,
          entityCourse,
        );
        existingCourses.push(savedCourse);
      }

      await queryRunner.commitTransaction();
      return newHighDemand;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ** busca alta demandas previamente registradas **
  async findInscriptions(
    obj: NewHighDemandRegistration,
  ): Promise<HighDemandRegistration[]> {
    const highDemandsRegisteredEntities = await this.highDemandRepository.find({
      where: {
        educationalInstitutionId: obj.id,
        operativeId: obj.operativeId,
      },
    });

    const existingRegistrations = highDemandsRegisteredEntities.map((e) =>
      HighDemandRegistrationEntity.toDomain(e),
    );

    return existingRegistrations;
  }

  async updateWorkflowStatus(
    obj: CreateHistoryDto,
  ): Promise<HighDemandRegistration> {
    const { highDemandRegistrationId, workflowStateId } = obj;
    const updatedHighDemand = await this.highDemandRepository.update(
      { id: highDemandRegistrationId },
      { workflowStateId: workflowStateId },
    );
    const highDemand = await this.highDemandRepository.findOne({
      where: {
        id: highDemandRegistrationId,
      },
    });
    await this._history.updatedHistory(obj);
    return HighDemandRegistrationEntity.toDomain(highDemand!);
  }

  async findByInstitutionId(
    educationalInstitutionId: number,
  ): Promise<HighDemandRegistration | null> {
    const highDemandRegistrationEntity =
      await this.highDemandRepository.findOne({
        where: {
          educationalInstitutionId: educationalInstitutionId,
          operativeId: 1,
        },
        withDeleted: true
      });
    if (!highDemandRegistrationEntity) return null;
    return HighDemandRegistrationEntity.toDomain(highDemandRegistrationEntity!);
  }

  async findById(id: number): Promise<HighDemandRegistration | null> {
    const highDemandRegistrationEntity =
      await this.highDemandRepository.findOne({ where: { id } });
    if (!highDemandRegistrationEntity) return null;
    return HighDemandRegistrationEntity.toDomain(highDemandRegistrationEntity);
  }

  // ** busca altas demandas por distrito que esten en la bandeja de entrada **
  async searchInbox(
    rolId: number,
    stateId: number,
    placeTypeId: number
  ): Promise<HighDemandRegistration[]> {
    const highDemands = await this.highDemandRepository.find({
      where: {
        workflowStateId: stateId,
        rolId: rolId,
        inbox: false,
        placeDistrict: { id: placeTypeId }
      },
      relations: ['courses', 'courses.level', 'courses.grade', 'courses.parallel']
    });
    return highDemands.map(HighDemandRegistrationEntity.toDomain);
  }

  // ** busca altas demandas por departamento que esten en la bandeja de entrada **
  async searchInboxByDepartment(rolId: number, stateId: number, placeTypeIds: number[]): Promise<HighDemandRegistration[]> {
    const highDemands = await this.highDemandRepository.find({
      where: {
        workflowStateId: stateId,
        rolId: rolId,
        inbox: true,
        placeDistrict: In(placeTypeIds)
      },
      relations: ['courses', 'courses.level', 'courses.grade', 'courses.parallel']
    });
    return highDemands.map(HighDemandRegistrationEntity.toDomain)
  }

  // ** busca altas demandas por distrito que esten recepcionadas **
  async searchReceived(rolId: number, placeTypeId: number): Promise<any> {
    const highDemands = await this.highDemandRepository.find({
      where: {
        workflowStateId: 2,
        rolId: rolId,
        inbox: true,
        placeDistrict: { id: placeTypeId }
      },
      relations: ['courses', 'courses.level', 'courses.grade', 'courses.parallel']
    });
    return highDemands.map(HighDemandRegistrationEntity.toDomain);
  }

  // ** recibir la alta demanda **
  async updatedInbox(id: number, nextStateId: number): Promise<HighDemandRegistration> {
    const result = await this.highDemandRepository.update(
      { id: id },
      { inbox: true, workflowStateId: nextStateId },
    );
    if (result.affected && result.affected <= 0) {
      throw new Error('No se actualiza el inbox');
    }
    const highDemandEntity = await this.highDemandRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!highDemandEntity) throw new Error('No existe la Alta Demanda');
    return HighDemandRegistrationEntity.toDomain(highDemandEntity);
  }

  // ** derivar la alta demanda **
  async deriveHighDemand(id: number, rolId: number): Promise<any> {
    const result = await this.highDemandRepository.update(
      { id: id },
      { inbox: false, workflowStateId: 1, rolId: rolId }
    )
    if(result.affected && result.affected <= 0) {
      throw new Error('No se actualizo el derive')
    }
    const highDemandEntity = await this.highDemandRepository.findOne({
      where: {
        id: id
      }
    })
    if(!highDemandEntity) throw new Error('No existe la Alta demanda')
    return HighDemandRegistrationEntity.toDomain(highDemandEntity)
  }

  // ** aprobar la alta demanda **
  async approveHighDemand(id: number, registrationStatus: RegistrationStatus): Promise<HighDemandRegistration> {
    const result = await this.highDemandRepository.update(
      { id: id },
      { registrationStatus: registrationStatus }
    )
    if(result.affected && result.affected <= 0) {
      throw new Error("No se aprobo la alta demanda")
    }
    const highDemandEntity = await this.highDemandRepository.findOne({
      where: {
        id: id,
      }
    })
    if(!highDemandEntity) throw new Error('No existe la Alta demanda');
    return HighDemandRegistrationEntity.toDomain(highDemandEntity)
  }

  // ** rechazar la alta demanda
  async declinehighDemand(id: number, registrationStatus: RegistrationStatus): Promise<HighDemandRegistration> {
    const result = await this.highDemandRepository.update(
      { id: id },
      { registrationStatus: registrationStatus }
    )
    if(result.affected && result.affected <= 0) {
      throw new Error("No se rechazo la alta demanda")
    }
    const highDemandEntity = await this.highDemandRepository.findOne({
      where: {
        id: id
      }
    })
    if(!highDemandEntity) throw new Error('No existe la Alta demanda');
    return HighDemandRegistrationEntity.toDomain(highDemandEntity)
  }

  // ** anular inscripción alta demanda
  async cancelHighDemand(obj: any, registrationStatus: RegistrationStatus): Promise<any> {
    const { highDemandRegistrationId: id } = obj
    const result = await this.highDemandRepository.update(
      { id: id, rolId: In([37, 9]), inbox: false, workflowStateId: 1 },
      { registrationStatus: registrationStatus, deletedAt: new Date() }
    )
    if(result.affected! <= 0) {
      throw new Error("No se anuló la alta demanda")
    }
    const highDemandEntity = await this.highDemandRepository.findOne({
      where: { id },
      withDeleted: true
    })
    if(!highDemandEntity) throw new Error('No existe la Alta Demanda');
    return HighDemandRegistrationEntity.toDomain(highDemandEntity)
  }

  // ** obtener altas demandas aprobadas **
  async getHighDemandsApproved(): Promise<any[]> {
    const highDemandsAproved = await this.highDemandRepository.find({
      where: {
        registrationStatus: RegistrationStatus.APPROVED,
        operativeId: 1 //TODO
      },
      relations: [
        'educationalInstitution',
        'educationalInstitution.state',
        'educationalInstitution.educationalInstitutionType',
        'educationalInstitution.dependencyType',
        'educationalInstitution.jurisdiction',
        'educationalInstitution.jurisdiction.localityPlaceType',
        'educationalInstitution.jurisdiction.localityPlaceType.parent.parent',
        'educationalInstitution.jurisdiction.localityPlaceType.parent.parent.parent',
        'educationalInstitution.jurisdiction.localityPlaceType.parent.parent.parent.parent',
        'courses',
        'courses.level',
        'courses.grade',
        'courses.parallel'
      ]
    })
    return highDemandsAproved
  }

  async searchFather(placeTypeId: number): Promise<any> {
    return this.placeTypeRepository
      .createQueryBuilder('hijo')
      .innerJoinAndSelect('hijo.parent', 'padre')
      .where('hijo.id = :id', { id: placeTypeId })
      .getOne()
      .then(result => result?.parent ?? null)
  }

  async searchChildren(parentId: number): Promise<PlaceTypeEntity[]> {
    return this.placeTypeRepository.find({
      where: { parentId: parentId },
    });
  }

}
