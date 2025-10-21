import { AbilityFactory } from "@access-control/application/services/ability.factory";
import { Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";

@Injectable()
export class PermissionRefresherService {
  private readonly logger = new Logger(PermissionRefresherService.name)

  // Caché de abilities por rol
  private abilityCache = new Map<number, any>()

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly abilityFactory: AbilityFactory
  ) {}

  async scheduleAbilityRefresh(roleId: number, operative: any) {
    if(!operative.datePostUEEnd) return;

    const endTime = new Date(operative.datePostUEEnd);
    const now = new Date();
    const delay = endTime.getTime() - now.getTime()

    if(delay <= 0) {
      this.logger.warn(`La fecha fin ya pasó para role ${roleId}`)
      return;
    }

    // programar la tarea
    const timeout = setTimeout(async () => {
      this.logger.log(`⏲ Fecha fin alcanzada - actualizando abilities para role ${roleId}`)
      this.abilityCache.delete(roleId);
      // await this.abilityFactory.createForRole(roleId, 1, 10, 5, operative.gestionId);
      this.schedulerRegistry.deleteTimeout(`refresh-${roleId}`)
    }, delay)

    this.schedulerRegistry.addTimeout(`refresh-${roleId}`, timeout);
    this.logger.log(`⏰ Programada actualización de abilities para role ${roleId} en ${delay/1000}s`)
  }

  // Al solicitar abilites de un usuario
  // async getAbility(roleId: number, userId: number, institutionId?:number, placeTypeId?:number, gestionId?:number) {
  //   let cached = this.abilityCache.get(roleId)
  //   if(!cached) {
  //     cached = await this.abilityFactory.createForRole(roleId, userId, institutionId, placeTypeId, gestionId);
  //     this.abilityCache.set(roleId, cached);
  //   }
  //   return cached;
  // }
}