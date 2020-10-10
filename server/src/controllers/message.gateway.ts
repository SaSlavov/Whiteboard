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
import { Message } from 'src/models/entities/message.entity';
import { MessageService } from 'src/services/message.service';
import { User } from 'src/models/entities/user.entity';



@WebSocketGateway(4001, { namespace: 'message', })
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @Inject()
  messageService: MessageService;

  @WebSocketServer()
  wss: Server;

  private logger: Logger = new Logger('MessageGateway');
  private count: number = 0;
  private roomId: number;

  public async handleDisconnect(client: any): Promise<void> {
    this.count -= 1;
    this.logger.log(`Disconnected: ${this.count} connections`);
  }

  public async handleConnection(client: any, ...args: any[]): Promise<void> {
    this.count += 1;
    this.logger.log(`Connected: ${this.count} connections`);
  }

  public async afterInit(server: any): Promise<void> {
    this.logger.log('MessageGateway Initialized');
  }

  @SubscribeMessage('new-message-to-server')
  async handleNewMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { sender: User; message: string, roomId: number }): Promise<void> {
    const message: Message = await this.messageService.CreateMessage(data.sender, data.message, data.roomId);
    this.wss.emit('new-message-to-client', message);
  }

  @SubscribeMessage('roomId-to-server')
  async handleRoomId(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: number }): Promise<void> {
    this.roomId = data.roomId

    const messages: Message[] = await this.messageService.getAll(data.roomId);
    messages && client.emit('all-messages-to-client', messages);
  }

}