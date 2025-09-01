



export abstract class PermissionService {
  abstract getActions(): Promise<any>;
  abstract getResources(): Promise<any>;
  abstract createPermission(obj: any): Promise<any>;
  abstract getOperators(): Promise<any>;
  abstract getFields(): Promise<any>;
  abstract changePermissionStatus(state: boolean): Promise<any>;
}