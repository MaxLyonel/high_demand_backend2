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

  afterInit() {
    this.logger.log('🚀 Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`🔌 Cliente conectado: ${client.id}`);
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
}
