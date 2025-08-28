import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PreRegistrationRepository } from "@pre-registration/domain/ports/outbound/pre-registration.repository";
import { PreRegistrationEntity } from "../entities/pre-registration.entity";
import { DataSource, In, Repository } from "typeorm";
import { RepresentativeEntity } from "../entities/representative.entity";
import { PostulantEntity } from "../entities/postulant.entity";
import { WorkRepresentativeEntity } from "../entities/work-representative.entity";
import { PreRegistrationStatus } from "@pre-registration/domain/enums/pre-registration-status.enum";
import { HighDemandRegistrationCourseEntity } from "@high-demand/infrastructure/adapters/secondary/persistence/entities/high-demand-course.entity";
import { PostulantResidence } from "../entities/postulant-residence.entity";
import { SegipService } from "@pre-registration/domain/ports/outbound/segip.service";
import { HistoryPreRegistrationEntity } from "../entities/history-pre-registration.entity";




@Injectable()
export class PreRegistrationRepositoryImpl implements PreRegistrationRepository {

  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    @InjectRepository(PreRegistrationEntity, 'alta_demanda')
    private readonly preRegistrationRepository: Repository<PreRegistrationEntity>,
    private readonly segipService: SegipService
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

      const personSEGIP = {
        nombres: guardian.name.trim().toUpperCase(),
        paterno: guardian.lastName.trim().toUpperCase(),
        materno: (guardian.mothersLastName || '').trim().toUpperCase(),
        ci: guardian.identityCard.trim().toUpperCase(),
        fechaNacimiento: guardian.dateBirth,
        complemento: (guardian.complement || '').trim().toUpperCase()
      }
      const typeCI = guardian.guardianNationality

      const result = await this.segipService.contrastar(personSEGIP, typeCI || 1)
      if(!result.finalizado) {
        throw new Error(result.mensaje)
      }

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

      if(justification === 2) { //! Guardar residencia del postulante
        const newPostulantResidence = await queryRunner.manager.save(PostulantResidence, {
          postulant: newPostulant,
          municipality: postulantResidence.municipality,
          area: postulantResidence.area,
          address: postulantResidence.address,
          telephone: postulantResidence.telephone
        })
      }
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
      if(justification === 3) { //! Guardar trabajo del apoderado
        const newWorkRepresentative = await queryRunner.manager.save(WorkRepresentativeEntity, {
          representative: newRepresentative,
          address: guardianWork.address,
          municipalityId: guardianWork.municipality.id,
          area: guardianWork.area,
          workPlaceName: guardianWork.placeName,
          phone: guardianWork.telephone
        })
      }

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

      const history = {
        preRegistration: { id: newPreRegistration.id},
        rol: { id: 49 }, // Rol postulante
        state: newPreRegistration.state,
        observation: '',
      }

      const newHistory = await queryRunner.manager.insert(HistoryPreRegistrationEntity, history)
      if (newHistory.identifiers.length > 0) {
        await queryRunner.commitTransaction()
      } else {
        throw new Error("Historial no registrado")
      }

      return newPreRegistration

    } catch(error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async invalidatePreRegistration(obj: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const result = await queryRunner.manager.update(PreRegistrationEntity,
        { id: obj.id },
        { state: PreRegistrationStatus.INVALIDATED, deletedAt: new Date() }
      )
      if (result.affected && result.affected > 0) {
        const updated = await queryRunner.manager.findOne(PreRegistrationEntity, {
          where: { id: obj.id },
          withDeleted: true
        })
        console.log("updated: ", updated)
        const history = {
          preRegistration: { id: obj.id },
          rol: { id: 9 },
          state: updated!.state,
          observation: obj.observation
        }
        const newHistory = await queryRunner.manager.insert(PreRegistrationEntity, history)
        if (newHistory.identifiers.length > 0) {
          await queryRunner.commitTransaction()
        } else {
          throw new Error('Historial no registrado')
        }
        return updated
      } else {
        throw new Error(`No se pudo invalidar la preinscripción`);
      }
    } catch(error) {
            console.log("hasta aqui 5")
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async validatePreRegistration(obj: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const result = await queryRunner.manager.update(PreRegistrationEntity,
        { id: obj.id },
        { state: PreRegistrationStatus.VALIDATED }
      )
      if(result.affected && result.affected > 0) {
        const updated = await queryRunner.manager.findOneBy(PreRegistrationEntity, { id: obj.id })
        const history = {
          preRegistration: { id: obj.id },
          rol: { id: 9 },
          state: updated!.state,
          observation: ''
        }
        const newHistory = await queryRunner.manager.insert(PreRegistrationEntity, history)
        if (newHistory.identifiers.length > 0) {
          await queryRunner.commitTransaction()
        } else {
          throw new Error('Historial no registrado')
        }
        return updated
      } else {
        throw new Error(`NO se pudo validar la preinscripción`)
      }
    } catch(error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async acceptPreRegistrations(obj: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      let count = 0;
      const updated: any[] = []
      for(let o of obj) {
        const result = await queryRunner.manager.update(PreRegistrationEntity,
          { id: o.id },
          { state: PreRegistrationStatus.ACCEPTED }
        )
        if(result.affected && result.affected < 0) {
          count++;
          const preRegistration = await queryRunner.manager.findOne(PreRegistrationEntity,
            { where : { id: o.id }}
          )
          const history = {
            preRegistration: { id: obj.id },
            rol: { id: 9 },
            state: preRegistration!.state,
            observation: ''
          }
          const newHistory = await queryRunner.manager.insert(PreRegistrationEntity, history)
          if (newHistory.identifiers.length > 0) {
            await queryRunner.commitTransaction()
          } else {
            throw new Error('Historial no registrado')
          }
          updated.push(preRegistration)
        }
      }
      if(count >= 0) {
        return updated
      } else {
        throw new Error("No se realizó el sorteo")
      }
    } catch(error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  async getAllPreRegistration(highDemandId: number): Promise<any> {
    const preRegistrations = await this.preRegistrationRepository.find({
      where: {
        highDemandCourse: { highDemandRegistrationId: highDemandId }
      },
      withDeleted: true,
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

  async getValidPreRegistrations(highDemandId: number): Promise<any> {
    const validPreRegistrations = await this.preRegistrationRepository.find({
      where: {
        highDemandCourse: { highDemandRegistrationId: highDemandId },
        state: In([PreRegistrationStatus.VALIDATED, PreRegistrationStatus.ACCEPTED])
      },
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
    return validPreRegistrations
  }

  async updateStatus(preRegistrationId: number): Promise<any> {
    const preRegistration = await this.preRegistrationRepository.findOne({
      where: {
        id: preRegistrationId
      },
    })
    if(!preRegistration) {
      throw new Error(`Pre registro no encontrado con el ID ${preRegistrationId}`)
    }
    preRegistration.state = PreRegistrationStatus.ACCEPTED
    return await this.preRegistrationRepository.save(preRegistration)
  }

  async getApplicantsAcceptedStatus(): Promise<any> {
    const preRegistrations = await this.preRegistrationRepository.find({
      where: {
        state: PreRegistrationStatus.ACCEPTED
      },
      relations: ['postulant', 'highDemandCourse', 'highDemandCourse.level', 'highDemandCourse.grade']
    })
    return preRegistrations
  }

}