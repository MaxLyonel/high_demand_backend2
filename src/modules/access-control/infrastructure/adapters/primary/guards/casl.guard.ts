import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_ABILITY, RequiredRule } from '../decorators/abilities.decorator';
import { AbilityFactory } from '@access-control/application/services/ability.factory';

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules = this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) || [];
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const roleId = user.roles[0].role.id
    const ability = await this.abilityFactory.createForRole(roleId, user.id);

    return rules.every((rule) => ability.can(rule.action, rule.subject));
  }
}