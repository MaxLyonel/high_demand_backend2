import { AbilityFactory } from "@access-control/application/services/ability.factory";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Verificar si es ruta pública
    return true
    // const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    // if(isPublic) {
    //    return true
    // }

    // // 2. Verificar si tiene decorador de permisos específicos
    // const requiredPermissions = this.reflector.get<{ action: string; subject: string}[]>(
    //   'permissions',
    //   context.getHandler()
    // );
    // // Si no hay permisos específicos requeridos, solo verificar autenticación
    // if(!requiredPermissions) {
    //   return true; // Usuario autenticado puede acceder
    // }

    // const request = context.switchToHttp().getRequest()
    // const user = request.user;
    // if(!user) {
    //   return false;
    // }
    // const ability = await this.abilityFactory.createForRole(
    //   user.roleId,
    //   user.userId,
    //   user.institutionId,
    //   user.placeTypeId,
    //   user.gestionId
    // );

    // return requiredPermissions.every(permission =>
    //   ability.can(permission.action, permission.subject)
    // )
  }
}