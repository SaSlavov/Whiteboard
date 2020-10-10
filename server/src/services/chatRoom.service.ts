import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatRoom } from "src/models/entities/chatRoom.entity";
import { User } from "src/models/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChatRoomService {
    constructor(
        @InjectRepository(ChatRoom) private readonly roomRepository: Repository<ChatRoom>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }
    async getRoom(senderId: number, receiverId: number): Promise<number[]> {
        const sender = await this.userRepository.findOne({
            where: {
                id: senderId
            },
            relations: ['chatRooms']
        });
        const receiver = await this.userRepository.findOne({
            where: {
                id: receiverId
            },
            relations: ['chatRooms']
        });

        const mutualRoom = await this.findRoom(sender, receiver)

        if (mutualRoom.length < 1) {
            const room = this.roomRepository.create();
            await this.roomRepository.save(room)
            sender.chatRooms.push(room)
            await this.userRepository.save(sender)
            receiver.chatRooms.push(room)
            await this.userRepository.save(receiver)

            const mutualRoom = await this.findRoom(sender, receiver)
            const newRoom = await this.roomRepository.findOne({
                where: {
                    id: mutualRoom[0].id
                },
                relations: ['participants']
            });
            newRoom.participants.push(sender, receiver)
            await this.roomRepository.save(newRoom)
            return mutualRoom
        }

        return mutualRoom;

    };

    async findRoom(sender: User, receiver: User) {

        if (sender.chatRooms.length < 1 || receiver.chatRooms.length < 1) {
            return []
        }
        const mutualRoom = sender.chatRooms.reduce((acc, senderRoom) => {
            const filtered = receiver.chatRooms.filter((receiverRoom) => senderRoom?.id === receiverRoom?.id)
            acc.push(...filtered)
            return acc
        }, [])

        return mutualRoom
    }

}