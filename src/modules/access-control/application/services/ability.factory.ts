// framework
import { Inject, Injectable } from "@nestjs/common";
// external dependency
import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
// own implementation
import { PermissionRepository } from "../../domain/ports/outbound/permission.repository";
import { OperationsProgrammingRepository } from "src/modules/operations-programming/domain/ports/outbound/operations-programming.repository";
import { PermissionsGateway } from "@access-control/infrastructure/adapters/secondary/services/websocket.permissions.gateway";
import { envs } from "@infrastructure-general/config"
import { DateTime } from 'luxon';

type Subjects = any | 'all'

type AppAbility = Ability<[string, Subjects | { __typename: string; [key: string]: any}]>;

@Injectable()
export class AbilityFactory {

  constructor(
    @Inject('APP_CONSTANTS') private readonly constants,
    private permissionRepo: PermissionRepository,
    private operativeRepo: OperationsProgrammingRepository,
    private permissionGateway: PermissionsGateway
  ) {}

  async createForRole(
      roleId: number,
      currentUserId: number,
      institutionId?: number | null,
      placeTypeId?: number | null,
      gestionId?: number
  ): Promise<AppAbility> {
    const operatorMap: Record<string, string | null> = {
      '=': null,
      '>': '$gt',
      '<': '$lt',
      '>=': '$gte',
      '<=': '$lte',
      'in': '$in'
    };

    const { can, build } = new AbilityBuilder<Ability<[string, any]>>(
      Ability as AbilityClass<AppAbility>
    );

    // Obtener el opertivo actual para validar fechas
    let currentOperative: any = null;
    if(gestionId) {
      currentOperative = await this.operativeRepo.getOperative(gestionId)
    }

    const permissions = await this.permissionRepo.findByRoleId(roleId);

    permissions.forEach((perm, index) => {
      if (!perm.action || !perm.subject) return;

      if(this.isPermissionExpired(roleId, currentOperative, perm)) {
        // console.log("permiso expirado! para rolId:", roleId)
        return;
      }

      let conditionsObj: Record<string, any> | undefined;

      if (perm.conditions?.length) {
        conditionsObj = {};
        perm.conditions.forEach((c) => {
          if(!conditionsObj![c.field]) conditionsObj![c.field] = {};

          const op = operatorMap[c.operator]
          const value =
          c.value === '$currentUserId' ? currentUserId :
          c.value === '$currentInstitutionId' ? institutionId :
          c.value === '$currentDistrictId' ? placeTypeId :
          c.value;

          if(op === null) {
            // conditionsObj![c.field] = c.value
            conditionsObj![c.field] = value
          } else {
            conditionsObj![c.field][op] = value
          }
        })
      }
      can(perm.action.name, perm.subject.name, conditionsObj)
    });

    return build({
      detectSubjectType: (object: any) => {
        if (!object) return 'all';
        if (typeof object === 'string') return object;
        if ('__typename' in object) return object.__typename;
        return 'all';
      }
    });
  }

  private isPermissionExpired(roleId: any, operative: any, perm?: any): boolean {
    if(envs.mode === 'development') {
      return false;
    }

    const { ROLES } = this.constants;

    const now = DateTime.now().setZone('America/La_Paz');

    if(perm?.action?.name === 'read' || perm?.action?.name === 'manage')
      return false;

    let expired = false;

    // Convertimos los timestamps de la base a hora Bolivia
    const datePosUEIni = operative?.datePosUEIni ? DateTime.fromJSDate(operative.datePosUEIni, { zone: 'America/La_Paz' }) : null;
    const datePosUEEnd = operative?.datePosUEEnd ? DateTime.fromJSDate(operative.datePosUEEnd, { zone: 'America/La_Paz' }) : null;
    const dateRevDisIni = operative?.dateRevDisIni ? DateTime.fromJSDate(operative.dateRevDisIni, { zone: 'America/La_Paz' }) : null;
    const dateRevDisEnd = operative?.dateRevDisEnd ? DateTime.fromJSDate(operative.dateRevDisEnd, { zone: 'America/La_Paz' }) : null;
    const dateRevDepIni = operative?.dateRevDepIni ? DateTime.fromJSDate(operative.dateRevDepIni, { zone: 'America/La_Paz' }) : null;
    const dateRevDepEnd = operative?.dateRevDepEnd ? DateTime.fromJSDate(operative.dateRevDepEnd, { zone: 'America/La_Paz' }) : null;

    switch(roleId) {
      case ROLES.DIRECTOR_ROLE:
        if (datePosUEIni && datePosUEEnd) {
          expired = now < datePosUEIni || now > datePosUEEnd;
        } else {
          expired = true;
        }
        break;
      case ROLES.DISTRICT_ROLE:
        if(dateRevDisIni && dateRevDisEnd) {
          expired = now < dateRevDisIni || now > dateRevDisEnd;
        } else {
          expired = true
        }
        break;
      case ROLES.DEPARTMENT_ROLE:
        if(dateRevDepIni && dateRevDepEnd) {
          expired = now < dateRevDepIni || now > dateRevDepEnd;
        } else {
          expired = true
        }
        break;
      default:
        expired = false;
        break;
    }
    return expired;
  }
}
