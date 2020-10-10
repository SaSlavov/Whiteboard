import { Body, Controller, Get, Param, Post, Req, UseGuards, Put, Delete } from '@nestjs/common';
import { BlacklistGuard } from '../auth/blacklist.guard';
import { ReturnBoardDTO } from '../models/dtos/boardDTOs/return-board.dto';
import { Board } from '../models/entities/board.entity';
import { BoardsService } from '../services/boards.service';

@Controller('boards')
export class BoardsController {

    constructor(
        private readonly boardService: BoardsService,
    ) { }

    @Get('/my_boards')
    @UseGuards(BlacklistGuard)
    async getMyBoards(
        @Req() request: any,
    ): Promise<any> { 
        
        return await this.boardService.getMyBoards(request.user);
    };

    @Get('/shared_boards')
    @UseGuards(BlacklistGuard)
    async getSharedBoards(
        @Req() request: any,
    ): Promise<any> { 
        return await this.boardService.getSharedBoards(request.user);
    };

    @Post()
    @UseGuards(BlacklistGuard)
    async createBoard(
        @Body() drawingData: any,
        @Req() request: any,
    ): Promise<number> {

        return await this.boardService.createBoard(request.user, drawingData);
    };

    @Put(':id')
    @UseGuards(BlacklistGuard)
    async updateBoard(
        @Body() drawingData: any,
        @Param('id') id: string
    ): Promise<Board> {

        return await this.boardService.updateBoard(+id, drawingData);
    };

    @Get(':id')
    @UseGuards(BlacklistGuard)
    async getBoard(
        @Param('id') id: string
    ): Promise<Board> {

        return await this.boardService.getBoard(+id);
    };

    @Get()
    @UseGuards(BlacklistGuard)
    async getAllBoards(
    ): Promise<ReturnBoardDTO[]> {
        return await this.boardService.getAllBoards();
    };

    @Delete(':id')
    @UseGuards(BlacklistGuard)
    async deleteBoard(
        @Param('id') boardId: string
    ): Promise<string> {

        return await this.boardService.deleteBoard(+boardId);
    };



};
