import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
import { PermissionRepository } from "../ports/outbound/permission.repository";
import { Injectable } from "@nestjs/common";


type AppAbility = Ability<[string, string]>;

@Injectable()
export class AbilityFactory {
  constructor(private permissionRepo: PermissionRepository) {
    console.log("se crea ability factory")
  }

  async createForRole(roleId: number): Promise<AppAbility> {
    const { can, build } = new AbilityBuilder<Ability<[string, string]>>(
      Ability as AbilityClass<AppAbility>
    );

    const permissions = await this.permissionRepo.findByRoleId(roleId);
    console.log("permissions: ", permissions)

    permissions.forEach((perm) => {
      if (perm.conditions?.length) {
        const conditionsObj: Record<string, any> = {};
        perm.conditions.forEach((c) => {
          // Podrías hacer mapeo del operador aquí, para simplicidad asigno valor directamente
          conditionsObj[c.field] = c.value;
        });
        can(perm.action, perm.subject, conditionsObj);
      } else {
        can(perm.action, perm.subject);
      }
    });

    return build();
  }
}