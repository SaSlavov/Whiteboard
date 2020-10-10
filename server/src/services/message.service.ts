import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatRoom } from "src/models/entities/chatRoom.entity";
import { Message } from "src/models/entities/message.entity";
import { User } from "src/models/entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(ChatRoom) private readonly roomRepository: Repository<ChatRoom>,
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }
    public async getAll(roomId: number): Promise<Message[]> {
        let previousId;
        if (previousId === roomId) {
            return
        }
        const messages = await this.messageRepository.find({
            where: { chatRoom: roomId }
        })
        previousId = roomId;

        return messages;
    }


    public async CreateMessage(sender: User, message: string, roomId: number): Promise<Message> {
        const room = await this.roomRepository.findOne({
            where: {
                id: roomId
            },
            relations: ['participants']
        });

        const user = await this.userRepository.findOne({
            where: {
                id: sender.id
            },
        });

        const newMessage = this.messageRepository.create();
        newMessage.sender = user.username
        newMessage.message = message
        newMessage.chatRoom = room

        return await newMessage.save();
    }
}
