import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ServicesModule } from 'src/services/services.module';
import { AuthController } from './auth.controller';
import { BoardsController } from './boards.controller';
import { MessageGateway } from './message.gateway';
import { UsersOnlineGateway } from './usersOnline.gateway';
import { ChatRoomController } from './chatRoom.controller';

@Module({
    imports: [ServicesModule],
    providers: [MessageGateway, UsersOnlineGateway],
    controllers: [UsersController, AuthController, BoardsController, ChatRoomController]
})
export class ControllersModule { }
