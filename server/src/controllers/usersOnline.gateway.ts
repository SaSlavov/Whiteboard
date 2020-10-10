import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Inject, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ReturnUserDTO } from 'src/models/dtos/userDTOs/return-user.dto';
import { UsersOnlineService } from 'src/services/usersOnline.service';



@WebSocketGateway(4002, { namespace: 'online_users', })
export class UsersOnlineGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

  @Inject()
  usersOnlineService: UsersOnlineService;

  @WebSocketServer()
  wss: Server;

  private logger: Logger = new Logger('UsersOnlineGateway');
  private count: number = 0;

  public async handleDisconnect(client: any): Promise<void> {
    this.count -= 1;
    this.logger.log(`Disconnected: ${this.count} connections`);
  }

  public async handleConnection(client: any, ...args: any[]): Promise<void> {
    this.count += 1;
    this.logger.log(`Connected: ${this.count} connections`);
    const usersOnline = await this.usersOnlineService.getAll();
    client.emit('all-users-to-client', usersOnline);
  }

  public async afterInit(server: any): Promise<void> {
    this.logger.log('MessageGateway Initialized');
  }

  @SubscribeMessage('new-user-online')
  async handleNewUserOnline(@ConnectedSocket() client: Socket, @MessageBody() user: ReturnUserDTO): Promise<void> {
    const usersOnline = await this.usersOnlineService.getAll();
    this.wss.emit('new-user-to-client', usersOnline);
  }
  @SubscribeMessage('new-user-offline')
  async handleNewUserOffline(@ConnectedSocket() client: Socket, @MessageBody() user: ReturnUserDTO): Promise<void> {
    const usersOnline = await this.usersOnlineService.getAll();
    this.wss.emit('new-user-to-client', usersOnline);
  }

}