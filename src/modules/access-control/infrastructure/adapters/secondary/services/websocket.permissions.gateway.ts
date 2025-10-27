import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PermissionsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(PermissionsGateway.name);

  private currentOperation:
    { active: boolean; start: Date; end: Date } | null = null;

  afterInit() {
    this.logger.log('🚀 Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`🔌 Cliente conectado: ${client.id}`);
    if(this.currentOperation) {
      client.emit('operative:current', this.currentOperation)
      this.logger.log(`=> Estado operativo enviado a ${client.id}`)
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`❌ Cliente desconectado: ${client.id}`);
  }

  async notifyPermissionChange(roleId?: number) {
    console.log("notificando...")
    this.server.emit('permission:changed', { roleId });
  }

  async notifyPermissionExpired(roleId: number) {
    console.log("Notificando.... expiración....")
    this.server.emit('permission:expired', { roleId })
  }

  async notifyPermissionActivated(roleId: number) {
    console.log("Notificando.... activado....")
    this.server.emit('permission:expired', { roleId })
  }

  async notifyCurrentOperation(data: { active: boolean; start: Date; end: Date }) {
    this.logger.log('Notificando estado de operativo....')
    this.currentOperation = data
    this.server.emit('operative:current', data)
  }
}
