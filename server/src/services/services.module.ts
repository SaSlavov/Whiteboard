import { Module } from '@nestjs/common';
import { User } from 'src/models/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Token } from 'src/models/entities/token.entity';
import { JwtStrategy } from './strategy/jwt-strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constant/secret';
import { BoardsService } from './boards.service';
import { Board } from 'src/models/entities/board.entity';
import { Message } from 'src/models/entities/message.entity';
import { MessageService } from './message.service';
import { ChatRoom } from 'src/models/entities/chatRoom.entity';
import { UsersOnlineService } from './usersOnline.service';
import { ChatRoomService } from './chatRoom.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token, Board, Message, ChatRoom,]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '7d',
      }
    }),
  ],
  providers: [UsersService, AuthService, JwtStrategy, BoardsService, MessageService, UsersOnlineService, ChatRoomService],
  exports: [UsersService, AuthService, BoardsService, MessageService, UsersOnlineService, ChatRoomService]

})
export class ServicesModule { }
