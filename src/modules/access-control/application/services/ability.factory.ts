// framework
import { Injectable } from "@nestjs/common";
// external dependency
import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
// own implementation
import { PermissionRepository } from "../../domain/ports/outbound/permission.repository";

type AppAbility = Ability<[string, string]>;

@Injectable()
export class AbilityFactory {
  constructor(private permissionRepo: PermissionRepository) {}

  async createForRole(roleId: number): Promise<AppAbility> {
    const { can, build } = new AbilityBuilder<Ability<[string, string]>>(
      Ability as AbilityClass<AppAbility>
    );

    const permissions = await this.permissionRepo.findByRoleId(roleId);

    permissions.forEach((perm) => {
      // Solo si action y subject existen
      if (!perm.action || !perm.subject) return;

      if (perm.conditions?.length) {
        const conditionsObj: Record<string, any> = {};
        perm.conditions.forEach((c) => {
          conditionsObj[c.field] = c.value;
        });
        can(perm.action.name, perm.subject.name, conditionsObj);
      } else {
        can(perm.action.name, perm.subject.name);
      }
    });

    return build();
  }
}
