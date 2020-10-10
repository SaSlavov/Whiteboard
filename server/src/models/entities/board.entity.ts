import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: null })
    topic: string;

    @Column({ type: "text", default: "" })
    drawing: string;

    @Column({ default: false })
    isPrivate: boolean;

    @Column({ default: false })
    isDeleted: boolean;

    @ManyToOne(
        () => User,
        user => user.id
    )
    author: User;

    @ManyToMany(
        () => User,
        user => user.id
    )
    sharedWith: User[];
};