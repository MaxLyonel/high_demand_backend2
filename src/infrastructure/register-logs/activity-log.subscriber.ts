// src/activity-log/activity-log.subscriber.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
  DataSource,
} from 'typeorm';
import { ActivityLogService } from './activity-log.service';
import { RequestContextService } from './request-context.service';

@Injectable()
@EventSubscriber()
export class GenericSubscriber implements EntitySubscriberInterface<any> {
  constructor(
    private readonly activityLogService: ActivityLogService,
    private readonly requestContext: RequestContextService,
    @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this); // registra automáticamente el subscriber
  }

  listenTo() {
    return Object; // escucha todas las entidades
  }

  private getCurrentUserId(): number | undefined {
    const user = this.requestContext.get<any>('user');
    return user?.id;
  }

  private shouldIgnoreEntity(entity: any): boolean {
    if (!entity) return true;
    const ignored = ['ActivityLog']; // evita bucles infinitos
    return ignored.includes(entity.constructor.name);
  }

  async afterInsert(event: InsertEvent<any>) {
    if (this.shouldIgnoreEntity(event.entity)) return;

    await this.activityLogService.log(
      'insert',
      event.metadata.tableName,
      event.entity?.id,
      this.getCurrentUserId(),
      event.entity
    );
  }

  async afterUpdate(event: UpdateEvent<any>) {
    const entity = event.entity ?? event.databaseEntity; // garantiza que tengamos la entidad
    if (this.shouldIgnoreEntity(entity)) return;

    const isSoftDelete = event.updatedColumns?.some(
      col => col.propertyName === 'deletedAt' && entity?.[col.propertyName] !== null
    );

    if (isSoftDelete) {
      // Registrar soft-delete
      await this.activityLogService.log(
        'soft-delete',
        event.metadata.tableName,
        entity?.id,
        this.getCurrentUserId(),
        entity
      );
    } else {
      // Registro normal de update
      await this.activityLogService.log(
        'update',
        event.metadata.tableName,
        entity?.id,
        this.getCurrentUserId(),
        {
          updatedColumns: event.updatedColumns?.map(c => c.propertyName) || [],
          oldValues: event.databaseEntity,
          newValues: entity,
        }
      );
    }
  }

  async afterRemove(event: RemoveEvent<any>) {
    if (this.shouldIgnoreEntity(event.entity)) return;

    await this.activityLogService.log(
      'remove',
      event.metadata.tableName,
      event.entity?.id,
      this.getCurrentUserId(),
      event.entity
    );
  }
}
