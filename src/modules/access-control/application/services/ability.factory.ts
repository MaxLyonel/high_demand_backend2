// framework
import { Injectable } from "@nestjs/common";
// external dependency
import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
// own implementation
import { PermissionRepository } from "../../domain/ports/outbound/permission.repository";

type Subjects = any | 'all'

type AppAbility = Ability<[string, Subjects | { __typename: string; [key: string]: any}]>;

@Injectable()
export class AbilityFactory {

  constructor(
    private permissionRepo: PermissionRepository
  ) {}

  async createForRole(roleId: number, currentUserId: number): Promise<AppAbility> {
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

    const permissions = await this.permissionRepo.findByRoleId(roleId);

    permissions.forEach((perm) => {
      if (!perm.action || !perm.subject) return; // no debería existir permisos sin una acción o recurso asignado

      let conditionsObj: Record<string, any> | undefined;

      if (perm.conditions?.length) {
        conditionsObj = {};
        perm.conditions.forEach((c) => {
          if(!conditionsObj![c.field]) conditionsObj![c.field] = {};

          const op = operatorMap[c.operator]
          const value = c.value === '$currentUserId' ? currentUserId : c.value

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
}
