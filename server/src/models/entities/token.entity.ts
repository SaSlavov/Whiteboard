import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ length: 300 })
    token: string;
    @CreateDateColumn()
    blacklistedOn: Date;
};