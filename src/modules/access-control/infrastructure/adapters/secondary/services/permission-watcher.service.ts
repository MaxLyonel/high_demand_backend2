import { Injectable, Logger } from "@nestjs/common";
import { OperationsProgrammingRepository } from "src/modules/operations-programming/domain/ports/outbound/operations-programming.repository";
import { PermissionsGateway } from "./websocket.permissions.gateway";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class PermissionWatcherService {
  private readonly logger = new Logger(PermissionWatcherService.name);

  // Para evitar notificar repetidamente el mismo estado
  private notifiedStates = new Map<number, 'active' | 'expired' | null>();

  constructor(
    private readonly operativeRepo: OperationsProgrammingRepository,
    private readonly gateway: PermissionsGateway
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkPermissionStatus() {
    const now = new Date();
    const currentGestion = now.getFullYear();
    const operative = await this.operativeRepo.getOperative(currentGestion);
    if (!operative) return;

    const permissions = [
      { roleId: 9, start: operative.datePosUEIni, end: operative.datePosUEEnd },
      { roleId: 37, start: operative.dateRevDisIni, end: operative.dateRevDisEnd },
      { roleId: 38, start: operative.dateRevDepIni, end: operative.dateRevDepEnd },
    ];

    for (const { roleId, start, end } of permissions) {
      const previousState = this.notifiedStates.get(roleId);

      // 🟢 Entra en vigencia
      if (now >= start && now <= end && previousState !== 'active') {
        this.gateway.notifyPermissionActivated(roleId);
        this.logger.log(`Permiso en vigencia para roleId = ${roleId}`);
        this.notifiedStates.set(roleId, 'active');
      }

      // 🔴 Expira
      if (now > end && previousState !== 'expired') {
        this.gateway.notifyPermissionExpired(roleId);
        this.logger.log(`Permiso expirado para roleId = ${roleId}`);
        this.notifiedStates.set(roleId, 'expired');
      }
    }
  }
}
