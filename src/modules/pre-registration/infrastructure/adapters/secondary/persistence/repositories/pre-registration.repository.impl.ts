import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PreRegistrationRepository } from "@pre-registration/domain/ports/outbound/pre-registration.repository";
import { PreRegistrationEntity } from "../entities/pre-registration.entity";
import { DataSource, Repository } from "typeorm";
import { RepresentativeEntity } from "../entities/representative.entity";
import { PostulantEntity } from "../entities/postulant.entity";
import { CriteriaEntity } from "../entities/criteria.entity";
import { WorkRepresentativeEntity } from "../entities/work-representative.entity";
import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum";
import { PreRegistrationStatus } from "@pre-registration/domain/enums/pre-registration-status.enum";
import { HighDemandRegistrationCourseEntity } from "@high-demand/infrastructure/adapters/secondary/persistence/entities/high-demand-course.entity";
import { PostulantResidence } from "../entities/postulant-residence.entity";




@Injectable()
export class PreRegistrationRepositoryImpl implements PreRegistrationRepository {

  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    @InjectRepository(PreRegistrationEntity, 'alta_demanda')
    private readonly preRegistrationRepository: Repository<PreRegistrationEntity>
  ){}

  async savePreRegistration(obj: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const {
        postulant,
        postulantResidence,
        guardian,
        guardianWork,
        courseId,
        justification
      } = obj
      // 1. Guardar postulante
      const newPostulant = await queryRunner.manager.save(PostulantEntity, {
        identityCard: postulant.identityCard,
        lastName: postulant.lastName,
        mothersLastName: postulant.mothersLastName,
        name: postulant.name,
        dateBirth: postulant.dateBirth,
        placeBirth: postulant.placeBirth,
        gender: postulant.gender,
        nationality: postulant.nationality // no hay este campo
      })

      // 2. Guardar residencia de postulante
      const newPostulantResidence = await queryRunner.manager.save(PostulantResidence, {
        postulant: newPostulant,
        municipality: postulantResidence.municipality,
        area: postulantResidence.area,
        address: postulantResidence.address,
        telephone: postulantResidence.telephone
      })

      // 3. Guardar apoderado
      const newRepresentative = await queryRunner.manager.save(RepresentativeEntity, {
        identityCard: guardian.identityCard,
        complement: guardian.complement,
        lastName: guardian.lastName,
        mothersLastName: guardian.mothersLastName,
        name: guardian.name,
        nationality: guardian.nationality,
        dateBirth: guardian.dateBirth,
        relationshipType: guardian.relationship
      })
      // 4. Guardar trabajo del apoderado
      const newWorkRepresentative = await queryRunner.manager.save(WorkRepresentativeEntity, {
        representative: newRepresentative,
        address: guardianWork.address,
        municipalityId: guardianWork.municipality.id,
        area: guardianWork.area,
        workPlaceName: guardianWork.placeName,
        phone: guardianWork.telephone
      })

      const searchCourse = await queryRunner.manager.findOne(HighDemandRegistrationCourseEntity, {
        where: {
          id: courseId
        }
      })
      if(!searchCourse) throw new Error("Curso no encontrado para la pre-inscripción");

      const newPreRegistration = await queryRunner.manager.save(PreRegistrationEntity, {
        representative: newRepresentative,
        postulant: newPostulant,
        criteria: justification,
        state: PreRegistrationStatus.REGISTER,
        highDemandCourse: searchCourse
      })
      await queryRunner.commitTransaction()
      return newPreRegistration

    } catch(error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async getAllPreRegistration(): Promise<any> {
    const preRegistrations = await this.preRegistrationRepository.find({
      relations: [
        'highDemandCourse',
        'highDemandCourse.level',
        'highDemandCourse.grade',
        'highDemandCourse.parallel',
        'representative',
        'postulant',
        'criteria'
      ]
    })
    return preRegistrations
  }

}