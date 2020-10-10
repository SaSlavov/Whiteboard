import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatRoom } from "src/models/entities/chatRoom.entity";
import { User } from "src/models/entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class UsersOnlineService {

    constructor(
        @InjectRepository(ChatRoom) private readonly roomRepository: Repository<ChatRoom>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }


    public async getAll(): Promise<User[]> {
        return this.userRepository.find({
            where: { online: 1 }
        });
    }
}