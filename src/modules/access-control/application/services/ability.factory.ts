// framework
import { Injectable } from "@nestjs/common";
// external dependency
import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
// own implementation
import { PermissionRepository } from "../../domain/ports/outbound/permission.repository";

type AppAbility = Ability<[string, string]>;

@Injectable()
export class AbilityFactory {

  constructor(
    private permissionRepo: PermissionRepository
  ) {}

  async createForRole(roleId: number): Promise<AppAbility> {
    const operatorMap: Record<string, string | null> = {
      '=': null,
      '>': '$gt',
      '<': '$lt',
      '>=': '$gte',
      '<=': '$lte',
      'in': '$in'
    };

    const { can, build } = new AbilityBuilder<Ability<[string, string]>>(
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

          if(op === null) {
            conditionsObj![c.field] = c.value
          } else {
            conditionsObj![c.field][op] = c.value
          }
        })
      }
      can(perm.action.name, perm.subject.name, conditionsObj)
    });

    return build();
  }
}
