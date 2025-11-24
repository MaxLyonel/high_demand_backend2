import { HistoryRepository } from "@high-demand/domain/ports/outbound/history.repository";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HistoryEntity } from "../entities/history.entity";
import { History } from "@high-demand/domain/models/history.model";
import { CreateHistoryDto } from "@high-demand/application/dtos/create-history.dto";
import { OperativeEntity } from "src/modules/operations-programming/infrastructure/adapters/secondary/persistence/entities/operations-programming.entity";
import { AbilityFactory } from "@access-control/application/services/ability.factory";


@Injectable()
export class HistoryRepositoryImpl implements HistoryRepository {

  constructor(
    @Inject('APP_CONSTANTS') private readonly constants,
    @InjectRepository(HistoryEntity, 'alta_demanda') private _historyRepository: Repository<HistoryEntity>,
    @InjectRepository(OperativeEntity, 'alta_demanda') private readonly operativeRepository: Repository<OperativeEntity>,
    private readonly abilityFactory: AbilityFactory
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

  async getHistories(user: any): Promise<History[]> {
    const { ROLES } = this.constants
    let filtered: HistoryEntity[] = []
    switch(user.selectedRoleId) {
      case ROLES.DIRECTOR_ROLE:
        filtered = await this._historyRepository.find({
          where: {
            highDemandRegistration: {
              educationalInstitutionId: user.institutionId
            }
          },
          withDeleted: true,
          relations: [
            'highDemandRegistration.educationalInstitution',
            'highDemandRegistration.placeDistrict',
            'user',
            'workflowState',
            'rol'
          ],
          order: {
            id: 'DESC'
          }
        })
        break;
      case ROLES.DISTRICT_ROLE:
        filtered = await this._historyRepository.find({
          where: {
            highDemandRegistration: {
              placeDistrict: {
                id: user.placeTypeId
              }
            }
          },
          withDeleted: true,
          relations: [
            'highDemandRegistration.educationalInstitution',
            'highDemandRegistration.placeDistrict',
            'user',
            'workflowState',
            'rol'
          ],
          order: {
            id: 'DESC'
          }
        })
        break;
      case ROLES.DEPARTMENT_ROLE:
        filtered = await this._historyRepository.find({
          where: {
            highDemandRegistration: {
              placeDistrict: {
                parent: {
                  id: user.placeTypeId
                }
              }
            }
          },
          withDeleted: true,
          relations: [
            'highDemandRegistration.educationalInstitution',
            'highDemandRegistration.placeDistrict',
            'user',
            'workflowState',
            'rol'
          ],
          order: {
            id: 'DESC'
          }
        })
        break;
      case ROLES.VER_ROLE:
      case ROLES.ADMIN_ROLE:
        filtered = await this._historyRepository.find({
          withDeleted: true,
          relations: [
            'highDemandRegistration.educationalInstitution',
            'highDemandRegistration.placeDistrict',
            'user',
            'workflowState',
            'rol'
          ],
          order: {
            id: 'DESC'
          }
        })
        break;
    }

    return filtered.map(entity => {
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

    // const ability = await this.abilityFactory.createForRole(
    //   user.selectedRoleId,
    //   user.id,
    //   user.institutionId,
    //   user.placeTypeId
    // );

    // const histories = await this._historyRepository.find({
    //   withDeleted: true,
    //   relations: [
    //     'highDemandRegistration.educationalInstitution',
    //     'highDemandRegistration.placeDistrict',
    //     'user',
    //     'workflowState',
    //     'rol'
    //   ],
    //   order: {
    //     id: 'DESC'
    //   }
    // });

    // const { ROLES } = this.constants;
    // let filtered: HistoryEntity[] = [];

    // switch (user.selectedRoleId) {
    //   case ROLES.DIRECTOR_ROLE:
    //     filtered = histories.filter(h => {
    //       const subject = {
    //         __typename: 'history',
    //         institucion_educativa_id: h.highDemandRegistration.educationalInstitution?.id
    //       };
    //       return ability.can('read', subject);
    //     });
    //     break;

    //   case ROLES.DISTRICT_ROLE:
    //     filtered = histories.filter(h => {
    //       const subject = {
    //         __typename: 'history',
    //         lugar_distrito_id: h.highDemandRegistration.placeDistrict?.id
    //       };
    //       return ability.can('read', subject);
    //     });
    //     break;

    //   case ROLES.DEPARTMENT_ROLE:
    //     // Para el departamental, asumimos que puede leer todo el histórico
    //     filtered = histories.filter(h => {
    //       const subject = { __typename: 'history' };
    //       return ability.can('read', subject);
    //     });
    //     break;
    // }

    // // Convertimos a dominio
    // return filtered.map(entity => {
    //   return new History(
    //     entity.id,
    //     entity.highDemandRegistration.id,
    //     entity.highDemandRegistration.educationalInstitution?.id,
    //     entity.highDemandRegistration.educationalInstitution?.name,
    //     entity.userId,
    //     entity.user.username,
    //     entity.rol.name,
    //     entity.rol.id,
    //     entity.workflowState.name,
    //     entity.registrationStatus,
    //     entity.observation,
    //     entity.createdAt,
    //     entity.updatedAt
    //   );
    // });
  }


  async getHighDemands(districtId: number): Promise<any[]> {
    const { CURRENT_YEAR, ROLES } = this.constants;

    const operative = await this.operativeRepository.findOne({
      where: { gestionId: CURRENT_YEAR },
      select: { id: true }
    });

    if (!operative)
      throw new Error("Períodos no definidos. Por favor, contáctese con el administrador.");

    const highDemands = await this._historyRepository.find({
      where: {
        workflowStateId: 2, // EN REVISION
        rolId: ROLES.DISTRICT_ROLE, // ROL DISTRITAL
        highDemandRegistration: {
          operativeId: operative.id,
          educationalInstitution: {
            jurisdiction: {
              districtPlaceType: { id: districtId }
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
        'highDemandRegistration.educationalInstitution.jurisdiction.localityPlaceType.parent.parent.parent.parent'
      ]
    });

    // Usamos un Map para evitar instituciones duplicadas
    const institutionMap = new Map<number, any>();

    for (const history of highDemands) {
      const institution = history?.highDemandRegistration?.educationalInstitution;
      if (!institution) continue;

      const institutionId = institution.id;
      const district = institution?.jurisdiction?.districtPlaceType?.place;
      const department = institution?.jurisdiction?.localityPlaceType?.parent?.parent?.parent?.parent?.place;

      // Si la institución ya fue agregada, solo agregamos los cursos nuevos
      if (institutionMap.has(institutionId)) {
        const existing = institutionMap.get(institutionId);
        const newCourses = history?.highDemandRegistration?.courses?.map(course => ({
          nivel: course?.level?.name,
          grade: course?.grade?.name,
          parallel: course?.parallel?.name,
          totalQuota: course?.totalQuota
        })) ?? [];
        existing.courses.push(...newCourses);
        continue;
      }

      // Si es una institución nueva, la añadimos al Map
      const courses = history?.highDemandRegistration?.courses?.map(course => ({
        nivel: course?.level?.name,
        grade: course?.grade?.name,
        parallel: course?.parallel?.name,
        totalQuota: course?.totalQuota
      })) ?? [];

      institutionMap.set(institutionId, {
        department,
        district,
        institution: {
          name: institution.name,
          rude: institution.id,
          dependency: institution?.dependencyType?.dependency
        },
        courses
      });
    }

    // Convertimos el Map en array final
    return Array.from(institutionMap.values());
  }


  async getHighDemandsByDepartment(departmentId: number): Promise<any> {
    const { CURRENT_YEAR, ROLES } = this.constants;

    const operative = await this.operativeRepository.findOne({
      where: { gestionId: CURRENT_YEAR },
      select: { id: true },
    });

    if (!operative)
      throw new Error(
        'Períodos no definidos. Por favor, contáctese con el administrador.'
      );

    const highDemands = await this._historyRepository.find({
      where: {
        workflowStateId: 2, // EN REVISIÓN
        rolId: ROLES.DEPARTMENT_ROLE, // ROL DEPARTAMENTAL
        highDemandRegistration: {
          operativeId: operative.id,
          educationalInstitution: {
            jurisdiction: {
              districtPlaceType: { parent: { id: departmentId } },
            },
          },
        },
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
        'highDemandRegistration.educationalInstitution.jurisdiction.localityPlaceType.parent.parent.parent.parent',
      ],
    });

    if (highDemands.length === 0) {
      return { department: 'Sin registros', districts: [] };
    }

    const departmentName =
      highDemands[0]?.highDemandRegistration?.educationalInstitution
        ?.jurisdiction?.localityPlaceType?.parent?.parent?.parent?.parent?.place ||
      'Sin nombre';

    // 🔹 Map para agrupar por distrito
    const districtMap = new Map<string, { districtName: string; institutions: any[] }>();

    for (const history of highDemands) {
      const institution = history.highDemandRegistration.educationalInstitution;
      if (!institution) continue;

      const district = institution?.jurisdiction?.districtPlaceType;
      const districtName = district?.place ?? 'Sin distrito';

      // Si el distrito no existe en el mapa, lo creamos
      if (!districtMap.has(districtName)) {
        districtMap.set(districtName, { districtName, institutions: [] });
      }

      const districtData = districtMap.get(districtName)!;

      // Buscar institución existente dentro del distrito
      let institutionData = districtData.institutions.find(
        (inst) => inst.rude === institution.id
      );

      if (!institutionData) {
        // Crear nueva institución
        institutionData = {
          name: institution.name,
          rude: institution.id,
          dependency: institution?.dependencyType?.dependency,
          courses: [],
        };
        districtData.institutions.push(institutionData);
      }

      // Agregar cursos evitando duplicados
      const existingCourseKeys = new Set(
        institutionData.courses.map(
          (c) => `${c.nivel}-${c.grade}-${c.parallel}`
        )
      );

      for (const course of history.highDemandRegistration.courses ?? []) {
        const key = `${course.level?.name}-${course.grade?.name}-${course.parallel?.name}`;
        if (!existingCourseKeys.has(key)) {
          institutionData.courses.push({
            nivel: course.level?.name,
            grade: course.grade?.name,
            parallel: course.parallel?.name,
            totalQuota: course.totalQuota,
          });
          existingCourseKeys.add(key);
        }
      }
    }

    // Convertimos el Map a array final
    const groupedDistricts = Array.from(districtMap.values());

    return {
      department: departmentName,
      districts: groupedDistricts,
    };
  }

}