// src/activity-log/activity-log.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ActivityLog } from "./activity-log.entity";

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog, 'alta_demanda')
    private readonly logRepo: Repository<ActivityLog>,
  ) {}

  async log(
    action: string,
    entity: string,
    entityId?: number,
    userId?: number,
    details?: any
  ) {
    const log = this.logRepo.create({
      userId,
      entity,
      entityId,
      action,
      details: details ? JSON.stringify(details) : null,
    });
    await this.logRepo.save(log);
  }
}
