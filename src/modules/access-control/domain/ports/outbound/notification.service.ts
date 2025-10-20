export abstract class NotificationPort {
  abstract notifyPermissionChange(userId?: number): Promise<void>;
}