// framework nestjs
import { Inject, Injectable } from "@nestjs/common";
// external dependencies
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
// own implementations
import { HighDemandCourseRepository } from "@high-demand/domain/ports/outbound/high-demand-course.repository"
import { HighDemandRegistrationCourse } from "@high-demand/domain/models/high-demand-registration-course.model"
import { HighDemandRegistrationCourseEntity } from '../entities/high-demand-course.entity';
import { HighDemandCourseDtoReponse } from "@high-demand/application/dtos/high-demand-course-response.dto";
import { HistoryEntity } from "../entities/history.entity";


@Injectable()
export class HighDemandCourseRepositoryImpl implements HighDemandCourseRepository {

  constructor(
    @Inject('APP_CONSTANTS') private readonly constants,
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    @InjectRepository(HighDemandRegistrationCourseEntity, 'alta_demanda')
    private readonly highDemandRegistrationCourseEntity: Repository<HighDemandRegistrationCourseEntity>,
    @InjectRepository(HistoryEntity, 'alta_demanda')
    private readonly historyRepository: Repository<HistoryEntity>,
  ) {}

  async saveHighDemandCourse(highDemandRegistrationId: number, courses: any): Promise<HighDemandRegistrationCourse[]> {
    const coursesSaved :Array<HighDemandRegistrationCourse> = []
    for(const course of courses) {
      const newCourse = { ...course, highDemandRegistrationId: highDemandRegistrationId}
      const newHighDemandCourse = await this.highDemandRegistrationCourseEntity.save(newCourse)
      coursesSaved.push(HighDemandRegistrationCourseEntity.toDomain(newHighDemandCourse))
    }
    return coursesSaved
  }

  async modifyQuota(highDemandCourseId: number, newQuota: number): Promise<HighDemandRegistrationCourse> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const updatedCourse = await queryRunner.manager.update(
        this.highDemandRegistrationCourseEntity.target,
        { id: highDemandCourseId },
        { totalQuota: newQuota }
      )
      if(updatedCourse.affected !== 1) {
        throw new Error("No se actualizo el cupo para este curso")
      }
      // const course = await this.highDemandRegistrationCourseEntity.findOneBy({ id: highDemandCourseId });
      const course = await queryRunner.manager.findOne(
        this.highDemandRegistrationCourseEntity.target,
        {
          where: { id: highDemandCourseId },
          relations: ['highDemandRegistration']
        }
      );

      const newHistory = {
        highDemandRegistrationId: course?.highDemandRegistration?.id,
        workflowStateId: course?.highDemandRegistration?.workflowStateId,
        registrationStatus: course?.highDemandRegistration?.registrationStatus,
        userId: course?.highDemandRegistration?.userId,
        rolId: this.constants.ROLES.VER_ROLE,
        observation: 'Actualizado por el VER'
      }
      await queryRunner.manager.insert(
        this.historyRepository.target,
        newHistory
      )
      console.log("se ejecuta esto?", course?.highDemandRegistration.id)
      await queryRunner.commitTransaction()
      return HighDemandRegistrationCourseEntity.toDomain(course!);

    } catch(error) {
      await queryRunner.rollbackTransaction()
      throw error;
    } finally {
      await queryRunner.release()
    }

  }

  async deleteCourse(highDemandCourseId: number): Promise<HighDemandRegistrationCourse> {
    const course = await this.highDemandRegistrationCourseEntity.findOneOrFail({
      where: { id: highDemandCourseId }
    });

    const result = await this.highDemandRegistrationCourseEntity.softDelete(highDemandCourseId);

    if (result.affected === 0) {
      throw new Error('No se encontró el curso para borrar');
    }

    return HighDemandRegistrationCourseEntity.toDomain(course);
  }

  async findById(id: number): Promise<HighDemandRegistrationCourse> {
    throw new Error("Method not implemented.");
  }

  async findByHighDemandRegistrationId(highDemandRegistrationId: number): Promise<HighDemandCourseDtoReponse[]> {
    const courses = await this.highDemandRegistrationCourseEntity.find({
      where: {
        highDemandRegistrationId: highDemandRegistrationId
      },
      relations: ['level', 'grade', 'parallel']
    })
    return courses.map(course => ({
      id: course.id,
      highDemandId: course.highDemandRegistrationId,
      levelName: course.level.name,
      levelId: course.level.id,
      gradeName: course.grade.name,
      gradeId: course.grade.id,
      parallelName: course.parallel.name,
      parallelId: course.parallel.id,
      totalQuota: course.totalQuota
    }));
  }

}