import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PreRegistrationRepository } from "@pre-registration/domain/ports/outbound/pre-registration.repository";
import { PreRegistrationEntity } from "../entities/pre-registration.entity";
import { DataSource, In, Repository } from "typeorm";
import { RepresentativeEntity } from "../entities/representative.entity";
import { PostulantEntity } from "../entities/postulant.entity";
import { PreRegistrationStatus } from "@pre-registration/domain/enums/pre-registration-status.enum";
import { HighDemandRegistrationCourseEntity } from "@high-demand/infrastructure/adapters/secondary/persistence/entities/high-demand-course.entity";
import { SegipService } from "@pre-registration/domain/ports/outbound/segip.service";
import { HistoryPreRegistrationEntity } from "../entities/history-pre-registration.entity";
import { PreRegistration } from "@pre-registration/domain/models/pre-registration.model";
import { PreRegistrationBrotherEntity } from "../entities/pre-registration-brother.entity";
import { PreRegistrationLocationEntity } from "../entities/pre-registration-location.entity";
import { LocationType } from "@pre-registration/domain/enums/location-type.enum";
import { StudentRepository } from "@pre-registration/domain/ports/outbound/student.repository";




@Injectable()
export class PreRegistrationRepositoryImpl implements PreRegistrationRepository {

  constructor(
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
    @InjectRepository(PreRegistrationEntity, 'alta_demanda')
    private readonly preRegistrationRepository: Repository<PreRegistrationEntity>,
    private readonly segipService: SegipService,
    @InjectRepository(PostulantEntity, 'alta_demanda')
    private readonly postulantRepository: Repository<PostulantEntity>,
    @InjectRepository(PreRegistrationBrotherEntity, 'alta_demanda')
    private readonly preRegistrationBrotherRepository: Repository<PreRegistrationBrotherEntity>,
    @InjectRepository(PreRegistrationLocationEntity, 'alta_demanda')
    private readonly preRegistrationLocationRepository: Repository<PreRegistrationLocationEntity>,
    private readonly studentRepository: StudentRepository
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
        justification,
        postulantSiblings
      } = obj

      // *************** Validación SEGIP - POSTULANTE ***************
      const postulantSEGIP = {
        nombres: postulant.name.trim().toUpperCase(),
        paterno: postulant.lastName.trim().toUpperCase(),
        materno: (postulant.mothersLastName || '').trim().toUpperCase(),
        ci: postulant.identityCard.trim().toUpperCase(),
        fechaNacimiento: postulant.dateBirth,
        complemento: (postulant.complement || '').trim().toUpperCase()
      }
      const postulantTypeCI = postulant.nationality
      const validationResult = await this.segipService.contrastar(postulantSEGIP, postulantTypeCI || 1)
      if(!validationResult.finalizado) {
        throw new Error(validationResult.mensaje)
      }
      // *************** Validación SEGIP - APODERADO ***************
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
      // *************** Buscando o creando al POSTULANTE ***************
      const existsPostulant = await queryRunner.manager.findOne(PostulantEntity, {
        where: {
          identityCard: postulant.identityCard,
        }
      });

      const newPostulant = existsPostulant ?? await queryRunner.manager.save(PostulantEntity, {
        identityCard: postulant.identityCard,
        complement: postulant.complement ?? '', // evita null
        lastName: postulant.lastName,
        mothersLastName: postulant.mothersLastName,
        name: postulant.name,
        dateBirth: postulant.dateBirth,
        placeBirth: postulant.placeBirth,
        gender: postulant.gender
      });

      // *************** Guardando APODERADO ***************
      const newRepresentative = await queryRunner.manager.save(RepresentativeEntity, {
        identityCard: guardian.identityCard,
        complement: guardian.complement,
        lastName: guardian.lastName,
        mothersLastName: guardian.mothersLastName,
        name: guardian.name,
        nationality: guardian.nationality,
        dateBirth: guardian.dateBirth,
        relationshipType: guardian.relationship,
        cellphone: guardian.cellphone
      })

      // *************** Guardando la PREINSCRIPCION ***************
      // 1. Validación de existencia de curso
      const searchCourse = await queryRunner.manager.findOne(HighDemandRegistrationCourseEntity, {
        where: { id: courseId }
      })
      if(!searchCourse) throw new Error("Curso no encontrado para la pre-inscripción");

      // 2. Validación de existencia de preinscripción
      const existingPreRegistrations = await queryRunner.manager.find(PreRegistrationEntity, {
        where: { postulant: { id: newPostulant.id } },
        relations: ['highDemandCourse', 'postulant']
      })
      // 3. Construir modelo de dominio y validar regla de negocio
      PreRegistration.create({
        id: 0, // aún no existe en BD
        highDemandCourseId: searchCourse, // entidad del curso
        representativeId: newRepresentative,
        postulantId: PostulantEntity.toDomain(newPostulant),
        criteriaId: justification,
        state: PreRegistrationStatus.REGISTER,
        existingPreRegistration: existingPreRegistrations.map(e =>
          new PreRegistration(
            e.id,
            e.highDemandCourse,
            e.representative,
            PostulantEntity.toDomain(e.postulant),
            e.criteria,
            e.state
          )
        )
      })
      // 4. Verificar la cantidad de cupos
      const numberPreRegistrations = await queryRunner.manager.find(PreRegistrationEntity, {
        where: { highDemandCourse: { id: courseId }}
      })
      if(numberPreRegistrations.length - 1 > searchCourse.totalQuota) {
        throw new Error("Ya se alcanzó el cupo máximo para este curso")
      }

      // obtener el último registro ordenado por id
      const [lastPreReg] = await queryRunner.manager.find(PreRegistrationEntity, {
        order: { id: 'DESC' },
        take: 1
      });

      let nextNumber = 1;
      if (lastPreReg) {
        // extraer número desde el code anterior, asumiendo formato HD-000001
        const lastCode = lastPreReg.code;
        const lastNumber = parseInt(lastCode.split('-')[1]);
        nextNumber = lastNumber + 1;
      }

      // generar el nuevo código
      const newCode = `HD-${nextNumber.toString().padStart(6, '0')}`;

      const newPreRegistration = await queryRunner.manager.save(PreRegistrationEntity, {
        representative: newRepresentative,
        postulant: newPostulant,
        criteria: justification,
        state: PreRegistrationStatus.REGISTER,
        highDemandCourse: searchCourse,
        code: newCode
      });

      // *************** Guardando HERMANO ***************
      if(justification === 1) {
        for(let sibling of postulantSiblings) {
          const preRegistrationBrother = await queryRunner.manager.save(PreRegistrationBrotherEntity, {
            codeRude: sibling.codeRude,
            preRegistration: newPreRegistration
          })
        }
      }

      // *************** Guardando VIVIENDA del POSTULANTE ***************
      if(justification === 2) {
        const preRegistrationLocation = await queryRunner.manager.save(PreRegistrationLocationEntity, {
          preRegistration: newPreRegistration,
          avenueStreetNro: postulantResidence.address,
          zoneVilla: postulantResidence.area,
          telephone: postulantResidence.telephone,
          municipality: postulantResidence.municipality,
          type: LocationType.DWELLING
        })
      }

      // *************** Guardando LUGAR TRABAJO APODERADO ***************
      if(justification === 3) { //! Guardar trabajo del apoderado
        const preRegistrationLocation = await queryRunner.manager.save(PreRegistrationLocationEntity, {
          preRegistration: newPreRegistration,
          avenueStreetNro: guardianWork.addressJob,
          zoneVilla: guardianWork.area,
          telephone: guardianWork.phoneJob,
          municipality: guardianWork.municipality,
          nameWorkPlace: guardianWork.placeName,
          type: LocationType.WORK_PLACE
        })
      }

      // ***** Guardando HISTORICO ******
      const history = {
        preRegistration: { id: newPreRegistration.id},
        rol: { id: 49 }, //TODO Rol postulante
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
        const history = {
          preRegistration: { id: obj.id },
          rol: { id: 9 },
          state: updated!.state,
          observation: obj.observation
        }
        const newHistory = await queryRunner.manager.insert(HistoryPreRegistrationEntity, history)
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
        const newHistory = await queryRunner.manager.insert(HistoryPreRegistrationEntity, history)
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
      let count = 0
      const updated: any[] = []

      for (let o of obj) {
        const result = await queryRunner.manager.update(
          PreRegistrationEntity,
          { id: o.id },
          { state: PreRegistrationStatus.ACCEPTED }
        )

        if (result.affected && result.affected > 0) {
          count++
          const preRegistration = await queryRunner.manager.findOne(
            PreRegistrationEntity,
            { where: { id: o.id } }
          )

          const history = {
            preRegistration: { id: o.id },
            rol: { id: 9 },
            state: preRegistration!.state,
            observation: ''
          }

          const newHistory = await queryRunner.manager.insert(
            HistoryPreRegistrationEntity,
            history
          )

          if (newHistory.identifiers.length === 0) {
            throw new Error('Historial no registrado')
          }

          updated.push(preRegistration)
        }
      }

      // 👈 commit SOLO una vez después de todo
      await queryRunner.commitTransaction()

      if (count > 0) {
        return updated
      } else {
        throw new Error("No se realizó el sorteo")
      }
    } catch (error) {
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

  async getPreRegistrationFollow(identityCardPostulant: string): Promise<any> {
    const postulant = await this.postulantRepository.findOne({
      where: {
        identityCard: identityCardPostulant
      }
    });

    if (!postulant) {
      throw new Error("No existe un postulante con ese número de carnet");
    }

    const preRegistrations = await this.preRegistrationRepository.find({
      where: {
        postulant: { id: postulant.id }
      },
      relations: [
        'postulant',
        'criteria',
        'highDemandCourse',
        'highDemandCourse.level',
        'highDemandCourse.grade',
        'highDemandCourse.parallel',
        'highDemandCourse.highDemandRegistration',
        'highDemandCourse.highDemandRegistration.educationalInstitution'
      ]
    });

    return preRegistrations;
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

  async getPreRegistrationInfo(postulantId: number): Promise<any> {
    const prereg = await this.preRegistrationRepository.findOne({
      where: { postulant: { id: postulantId } },
      relations: [
        'postulant',
        'criteria',
        'representative.relationshipType',
        'highDemandCourse.level',
        'highDemandCourse.grade',
        'highDemandCourse.highDemandRegistration.educationalInstitution.dependencyType',
        'highDemandCourse.highDemandRegistration.educationalInstitution.jurisdiction.districtPlaceType.parent'
      ]
    });

    if (!prereg) return null;

    // pre registro de hermano
    const preregBrother = await this.preRegistrationBrotherRepository.findOne({
      where: { preRegistration: { id: prereg.id } },
      select: { id: true, codeRude: true }
    })

    const sie = prereg.highDemandCourse?.highDemandRegistration?.educationalInstitution?.id

    const educationBrother = await this.studentRepository.searchByRUDE(sie, preregBrother?.codeRude || '')
    console.log("hasta aca", educationBrother)

    // pre registro de localidad
    // const preregLocation = await this.preRegistrationLocationRepository.findOne({
    //   where: { preRegistration: { id: prereg.id }, type: LocationType.DWELLING },
    // })

    const now = new Date().getFullYear()

    return {
      id: prereg.id,
      state: prereg.state,
      code: prereg.code,
      institution: {
        id: prereg.highDemandCourse?.highDemandRegistration?.educationalInstitution?.id,
        name: prereg.highDemandCourse?.highDemandRegistration?.educationalInstitution?.name,
        dependency: prereg.highDemandCourse?.highDemandRegistration?.educationalInstitution?.dependencyType?.dependency,
        area: prereg.highDemandCourse?.highDemandRegistration?.educationalInstitution?.jurisdiction?.area,
        district: prereg.highDemandCourse?.highDemandRegistration?.educationalInstitution?.jurisdiction?.districtPlaceType?.place,
        department: prereg.highDemandCourse?.highDemandRegistration?.educationalInstitution?.jurisdiction?.districtPlaceType?.parent?.place,
      },
      postulant: {
        id: prereg.postulant.id,
        lastName: prereg.postulant.lastName,
        mothersLastName: prereg.postulant.mothersLastName,
        name: prereg.postulant.name,
        identityCard: prereg.postulant.identityCard,
        birthDate: prereg.postulant.dateBirth,
        placeBirth: prereg.postulant.placeBirth,
        gender: prereg.postulant.gender,
        age: now - new Date(prereg.postulant.dateBirth).getFullYear(),
        months: this.getAgeWithMonths(prereg.postulant.dateBirth),
      },
      representative: {
        id: prereg.representative?.id,
        lastName: prereg.representative.lastName,
        mothersLastName: prereg.representative.mothersLastName,
        name: prereg.representative?.name,
        identityCard: prereg.representative.identityCard,
        relation: prereg.representative?.relationshipType?.name,
      },
      registration: {
        criteria: {
          id: prereg.criteria.id,
          name: prereg.criteria.name,
        },
        course: {
          id: prereg.highDemandCourse?.id,
          level: prereg.highDemandCourse?.level?.name,
          grade: prereg.highDemandCourse?.grade?.name,
        }
      },
      registrationBrother: {
        id: preregBrother?.id,
        codeRude: preregBrother?.codeRude,
        educationBrother: {
          id: educationBrother?.id,
          level: educationBrother?.nivel,
          grade: educationBrother?.grado
        }
      },
      // registrationLocation: preregLocation
    };
  }

  getAgeWithMonths(dateBirth: Date) {
    const now = new Date();
    const birth = new Date(dateBirth);

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    const days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return months
  }

}