// framework nestjs
import { Inject, Injectable } from '@nestjs/common';
// external independencies
import { DataSource, Repository } from 'typeorm';
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
    private readonly _history: HistoryRepository,
  ) {}

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
        // Crear dominio sin id
        const domainCourse = HighDemandRegistrationCourse.create({
          id: null, // o simplemente no incluirlo en create
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

        // Mapear a entidad TypeORM sin id, TypeORM lo generará
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
        existingCourses.push(savedCourse); // actualizar lista
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

  async searchByInbox(
    rolId: number,
    stateId: number,
  ): Promise<HighDemandRegistration[]> {
    const highDemands = await this.highDemandRepository.find({
      where: {
        workflowStateId: stateId,
        rolId: rolId,
        inbox: false,
      },
    });
    return highDemands.map(HighDemandRegistrationEntity.toDomain);
  }

  async searchByReceived(rolId: number, stateId: number): Promise<any> {
    const highDemands = await this.highDemandRepository.find({
      where: {
        workflowStateId: stateId,
        rolId: rolId,
        inbox: true,
      },
    });
    return highDemands.map(HighDemandRegistrationEntity.toDomain);
  }

  async updatedInbox(id: number): Promise<HighDemandRegistration> {
    const result = await this.highDemandRepository.update(
      { id: id },
      { inbox: true },
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
}
