import { Inject, Injectable, Logger } from "@nestjs/common";
import { OperationsProgrammingRepository } from "src/modules/operations-programming/domain/ports/outbound/operations-programming.repository";
import { PermissionsGateway } from "./websocket.permissions.gateway";
import { Cron, CronExpression } from "@nestjs/schedule";
import { envs } from '../../../../../../infrastructure/config/envs';
import { DateTime } from 'luxon';

@Injectable()
export class PermissionWatcherService {
  private readonly logger = new Logger(PermissionWatcherService.name);

  // Para evitar notificar repetidamente el mismo estado
  private notifiedStates = new Map<number | 'operative', 'active' | 'expired' | null>();

  constructor(
    @Inject('APP_CONSTANTS') private readonly constants,
    private readonly operativeRepo: OperationsProgrammingRepository,
    private readonly gateway: PermissionsGateway
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkPermissionStatus() {
    const { ROLES } = this.constants;

    const operative = await this.operativeRepo.getOperative(DateTime.now().setZone('America/La_Paz').year);
    if (!operative) return;

    // Convertimos todos los timestamps sin zona a hora Bolivia
    const permissions = [
      { roleId: ROLES.DIRECTOR_ROLE, start: DateTime.fromJSDate(operative.datePosUEIni, { zone: 'America/La_Paz' }), end: DateTime.fromJSDate(operative.datePosUEEnd, { zone: 'America/La_Paz' }) },
      { roleId: ROLES.DISTRICT_ROLE, start: DateTime.fromJSDate(operative.dateRevDisIni, { zone: 'America/La_Paz' }), end: DateTime.fromJSDate(operative.dateRevDisEnd, { zone: 'America/La_Paz' }) },
      { roleId: ROLES.DEPARTMENT_ROLE, start: DateTime.fromJSDate(operative.dateRevDepIni, { zone: 'America/La_Paz' }), end: DateTime.fromJSDate(operative.dateRevDepEnd, { zone: 'America/La_Paz' }) },
    ];

    const now = DateTime.now().setZone('America/La_Paz');

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

    // Operativo general
    const operativeStart = DateTime.fromJSDate(operative.dateOpeIni, { zone: 'America/La_Paz' });
    const operativeEnd = DateTime.fromJSDate(operative.dateOpeEnd, { zone: 'America/La_Paz' });
    const isActive = now >= operativeStart && now <= operativeEnd;

    this.gateway.notifyCurrentOperation({
      active: envs.mode === 'development' ? true : isActive,
      start: operativeStart.toJSDate(),
      end: operativeEnd.toJSDate()
    });
  }
}
