import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReturnBoardDTO } from '../models/dtos/boardDTOs/return-board.dto';
import { Board } from '../models/entities/board.entity';
import { User } from '../models/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {

    constructor(
        @InjectRepository(Board) private readonly boardRepository: Repository<Board>,
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
    ) { }

    async createBoard(user: User, drawingData: any): Promise<number> {
        const board = new Board();
        board.author = user;
        board.topic = drawingData.topic;
        board.drawing = '[[{"tool":"Brush","color":"#FFFFFF","points":[{"x":0,"y":0}]}]]';
        const newBoard = await this.boardRepository.save(board);

        return newBoard.id;
    };

    async getBoard(boardId: number): Promise<Board> {
        return await this.boardRepository.findOne({
            where: {
                id: boardId
            }
        });
    };

    async getAllBoards(): Promise<ReturnBoardDTO[]> {
        const boards = await this.boardRepository.find({
            where: {
                isPrivate: "false",
                isDeleted: "false",
            },
            relations: ['author']
        });

        const transformedBoards = boards.map((board) => {
            const newBoard = {
                id: board.id,
                drawing: board.drawing,
                author: board.author.username,
                isPrivate: board.isPrivate,
                topic: board.topic,
                isDeleted: board.isDeleted,
            };
            return newBoard;
        });

        return transformedBoards;
    };

    async updateBoard(boardId: number, drawingData: object): Promise<Board> {
        const board = await this.boardRepository.findOne({
            where: {
                id: boardId
            }
        });
        board.drawing = JSON.stringify(drawingData);

        const updatedBoard = await this.boardRepository.save(board);

        return updatedBoard;
    };

    async deleteBoard(boardId): Promise<string> {
        const boardToDelete = await this.boardRepository.findOne({
            where: {
                id: boardId
            }
        });

        boardToDelete.isDeleted = true;
        await this.boardRepository.save(boardToDelete);

        return 'Successful delete';
    };

    async getMyBoards(user: User): Promise<ReturnBoardDTO[]> {
        const boards = await this.boardRepository.find({
            where: {
                author: user,
                isDeleted: "false",
            },
            relations: ['author']
        });

        const transformedBoards = boards.map((board) => {
            const newBoard = {
                id: board.id,
                drawing: board.drawing,
                author: board.author.username,
                isPrivate: board.isPrivate,
                topic: board.topic,
                isDeleted: board.isDeleted,
            };
            return newBoard;
        });
        
        return transformedBoards;
    };

    async getSharedBoards(currentUser: User): Promise<any> {
        const boards = await this.boardRepository.find({
            where: {
                isDeleted: "false",
            },
            relations: [ 'author']
        })
        const user = await this.usersRepository.findOne({
            where: {
                id: currentUser.id,
                isDeleted: "false",
            },
            relations: ['boardsInvitations']
        })
        const transformedBoards = user.boardsInvitations.filter(board => board.isDeleted === false).map((board) => {
            const newBoard = {
                id: board.id,
                drawing: board.drawing,
                author: boards.find(currentBoard => currentBoard.id === board.id).author.username,
                isPrivate: board.isPrivate,
                topic: board.topic,
                isDeleted: board.isDeleted,
            };
            return newBoard;
        });        
        
        return transformedBoards;
    };
};
