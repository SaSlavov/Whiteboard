import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Message } from "./message.entity";
import { User } from "./user.entity";

@Entity()
export class ChatRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(
        () => User,
        user => user.chatRooms
    )
    @JoinTable()
    participants: User[];
    @OneToMany(
        () => Message,
        message => message.chatRoom
    )
    @JoinTable()
    messages: Message[];
}