import { Controller, Param, Get } from '@nestjs/common';
import { ChatRoomService } from 'src/services/chatRoom.service';


@Controller('room')
export class ChatRoomController {
    constructor(
        private readonly roomService: ChatRoomService,
    ) { }

    @Get('/sender/:senderId/receiver/:receiverId')
    async getRoom(
        @Param('senderId') senderId: string,
        @Param('receiverId') receiverId: string
    ): Promise<number[]> {
        return await this.roomService.getRoom(+senderId, +receiverId);
    }

}