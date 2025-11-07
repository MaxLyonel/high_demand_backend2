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
import { OperativeEntity } from 'src/modules/operations-programming/infrastructure/adapters/secondary/persistence/entities/operations-programming.entity';
import { WorkflowSequenceRepository } from '@high-demand/domain/ports/outbound/workflow-sequence.repository';
import { HistoryEntity } from '../entities/history.entity';

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
    @Inject('APP_CONSTANTS') private readonly constants,
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    @InjectRepository(HighDemandRegistrationEntity, 'alta_demanda')
    private readonly highDemandRepository: Repository<HighDemandRegistrationEntity>,
    @InjectRepository(HighDemandRegistrationCourseEntity, 'alta_demanda')
    private readonly highDemandCourseRepository: Repository<HighDemandRegistrationCourseEntity>,
    @InjectRepository(PlaceTypeEntity, 'alta_demanda')
    private readonly placeTypeRepository: Repository<PlaceTypeEntity>,
    private readonly _history: HistoryRepository,
    @InjectRepository(OperativeEntity, 'alta_demanda')
    private readonly operativeRepository: Repository<OperativeEntity>,
    private readonly workflowSequenceRepository: WorkflowSequenceRepository,
    @InjectRepository(HistoryEntity, 'alta_demanda')
    private readonly historyRepository: Repository<HistoryEntity>,
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
      const { courses, educationalInstitutionId } = obj;

      let highDemand = await queryRunner.manager.findOne(
        this.highDemandRepository.target,
        {
          where: { educationalInstitutionId }
        }
      )
      // para el historico
      const { rolId } = obj
      const workflowSequence = await this.workflowSequenceRepository.findNextStates(rolId)
      const { nextState } = workflowSequence[0]
      obj.rolId = nextState
      obj.workflowStateId = 1
      obj.inbox = false

      if(!highDemand) {

        const highDemandToSave = { ...obj, courses: undefined };
        highDemand = await queryRunner.manager.save(
          this.highDemandRepository.target,
          highDemandToSave
        )
      }

      // 2. Traer cursos existentes persistidos para esta inscripción
      const existingCourses = await queryRunner.manager.find(
        this.highDemandCourseRepository.target,
        {
          where: { highDemandRegistrationId: highDemand!.id },
        },
      );

      const incomingKeys = courses.map(
        (c) => `${c.levelId}-${c.gradeId}-${c.parallelId}`
      )
      const existingKeys = existingCourses.map(
        (c) => `${c.levelId}-${c.gradeId}-${c.parallelId}`,
      );

      // Determinar qué eliminar y qué agregar
      const toDelete = existingCourses.filter(
        (c) => !incomingKeys.includes(`${c.levelId}-${c.gradeId}-${c.parallelId}`)
      )
      const toAdd = courses.filter(
        (c) => !existingKeys.includes(`${c.levelId}-${c.gradeId}-${c.parallelId}`)
      )
      if(toDelete.length > 0) {
        const idsToDelete = toDelete.map((c) => c.id)
        await queryRunner.manager.delete(
          this.highDemandCourseRepository.target,
          idsToDelete
        )
      }

      // 3. Crear y validar cursos en el dominio
      for (const course of toAdd) {
        const domainCourse = HighDemandRegistrationCourse.create({
          id: null,
          highDemandRegistrationId: highDemand!.id,
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

        await queryRunner.manager.save(
          this.highDemandCourseRepository.target,
          entityCourse,
        );
      }

      // guardando historial
      const newHistory = {
        highDemandRegistrationId: highDemand!.id,
        workflowStateId: highDemand!.workflowStateId,
        registrationStatus: highDemand!.registrationStatus,
        userId: highDemand!.userId,
        rolId: highDemand!.rolId,
        observation: ''
      }
      await queryRunner.manager.insert(
        this.historyRepository.target,
        newHistory
      )

      await queryRunner.commitTransaction();
      return highDemand!;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async editHighDemandRegistration(obj: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { highDemand, courses, currentRole } = obj
      const existingCourses = await queryRunner.manager.find(
        this.highDemandCourseRepository.target,
        {
          where: { highDemandRegistrationId: highDemand.id },
        },
      );
      const incomingKeys = courses.map(
        (c) => `${c.levelId}-${c.gradeId}-${c.parallelId}`
      )
      const existingKeys = existingCourses.map(
        (c) => `${c.levelId}-${c.gradeId}-${c.parallelId}`,
      );
      // Determinar qué eliminar y qué agregar
      const toDelete = existingCourses.filter(
        (c) => !incomingKeys.includes(`${c.levelId}-${c.gradeId}-${c.parallelId}`)
      )
      const toAdd = courses.filter(
        (c) => !existingKeys.includes(`${c.levelId}-${c.gradeId}-${c.parallelId}`)
      )

      // 4️⃣ Detectar los cursos existentes cuyo totalQuota cambió
      const toUpdate = existingCourses.filter((existing) => {
        const incoming = courses.find(
          (c) =>
            c.levelId === existing.levelId &&
            c.gradeId === existing.gradeId &&
            c.parallelId === existing.parallelId &&
            c.totalQuota !== existing.totalQuota
        );
        return incoming !== undefined;
      });

      if(toDelete.length > 0) {
        const idsToDelete = toDelete.map((c) => c.id)
        await queryRunner.manager.delete(
          this.highDemandCourseRepository.target,
          idsToDelete
        )
      }

      // 6️⃣ Actualizar los que cambiaron totalQuota
      for (const existing of toUpdate) {
        const updatedCourse = courses.find(
          (c) =>
            c.levelId === existing.levelId &&
            c.gradeId === existing.gradeId &&
            c.parallelId === existing.parallelId
        );
        await queryRunner.manager.update(
          this.highDemandCourseRepository.target,
          { id: existing.id },
          { totalQuota: updatedCourse.totalQuota }
        );
      }
            // 3. Crear y validar cursos en el dominio
      for (const course of toAdd) {
        const domainCourse = HighDemandRegistrationCourse.create({
          id: null,
          highDemandRegistrationId: highDemand.id,
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

        await queryRunner.manager.save(
          this.highDemandCourseRepository.target,
          entityCourse,
        );
      }
      const newHistory = {
        highDemandRegistrationId: highDemand!.id,
        workflowStateId: highDemand!.workflowStateId,
        registrationStatus: highDemand!.registrationStatus,
        userId: highDemand!.userId,
        rolId: highDemand!.rolId,
        observation: `Modificado por el ${currentRole?.role?.id === 9 ? 'Director' : 'Distrital'}`
      }
      await queryRunner.manager.insert(
        this.historyRepository.target,
        newHistory
      )

      await queryRunner.commitTransaction();
    } catch(error) {
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
    const { CURRENT_YEAR } = this.constants
    const operative = await this.operativeRepository.findOne({
      where: { gestionId: CURRENT_YEAR },
      select: { id: true }
    })
    if(!operative) throw new Error("Períodos no definidos. Por favor contactese con el administrador")
    const highDemandRegistrationEntity =
      await this.highDemandRepository.findOne({
        where: {
          educationalInstitutionId: educationalInstitutionId,
          operativeId: operative.id,
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

  // ** anular inscripción alta demanda
  async cancelHighDemand(obj: any, registrationStatus: RegistrationStatus): Promise<any> {
    const { ROLES } = this.constants
    const { DIRECTOR_ROLE, DISTRICT_ROLE } = ROLES
    const { highDemandRegistrationId: id } = obj
    const result = await this.highDemandRepository.update(
      { id: id, rolId: In([DISTRICT_ROLE, DIRECTOR_ROLE]), inbox: false, workflowStateId: 1 },
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
  async getHighDemandsApproved(departmentId: number): Promise<any[]> {
    const { CURRENT_YEAR } = this.constants
    const operative = await this.operativeRepository.findOne({
      where: { gestionId: CURRENT_YEAR },
      select: { id: true }
    })
    if(!operative) throw new Error("Períodos no definidos. Por favor contáctese con el administrador")
    const highDemandsAproved = await this.highDemandRepository.find({
      where: {
        registrationStatus: RegistrationStatus.APPROVED,
        operativeId: operative.id,
        educationalInstitution: {
          jurisdiction: {
            localityPlaceType: {
              parent: {
                parent: {
                  parent: {
                    parent: {
                      id: departmentId
                    }
                  }
                }
              }
            }
          }
        }
      },
      relations: [
        'educationalInstitution',
        'educationalInstitution.state',
        'educationalInstitution.educationalInstitutionType',
        'educationalInstitution.dependencyType',
        'educationalInstitution.jurisdiction',
        'educationalInstitution.jurisdiction.districtPlaceType',
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

  // ** obtener la alta demanda registrada **
  async getHighDemandRegistered(highDemandId: number): Promise<any> {
    const { CURRENT_YEAR } = this.constants
    const operative = await this.operativeRepository.findOne({
      where: { gestionId: CURRENT_YEAR },
      select: { id: true }
    })
    if(!operative) throw new Error("Periódos no definidos. Por favor contáctese con el administrador");
    const highDemandAproved = await this.highDemandRepository.findOne({
      where: {
        id: highDemandId,
        // registrationStatus: RegistrationStatus.APPROVED,
        operativeId: operative.id,
      },
      relations: [
        'educationalInstitution',
        'educationalInstitution.state',
        'educationalInstitution.educationalInstitutionType',
        'educationalInstitution.dependencyType',
        'educationalInstitution.jurisdiction',
        'educationalInstitution.jurisdiction.districtPlaceType',
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
    return highDemandAproved
  }

  // ** obtener los niveles de la alta demanda registrada **
  async getHighDemandLevels(obj: any): Promise<any> {
    const { CURRENT_YEAR } = this.constants
    const operative = await this.operativeRepository.findOne({
      where: { gestionId: CURRENT_YEAR },
      select: { id: true }
    })
    if(!operative) throw new Error("Periódos no definidos. Por favor contáctese con el administrador");
    const highDemand = await this.highDemandRepository.findOne({
      where: {
        id: obj,
        operativeId: operative.id,
      },
      relations: [
        'courses',
        'courses.level',
        'courses.grade',
        'courses.parallel'
      ]
    })
    return highDemand
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
    const result = await this.placeTypeRepository.find({
      where: { parentId: parentId },
    });
    return result
  }
}
