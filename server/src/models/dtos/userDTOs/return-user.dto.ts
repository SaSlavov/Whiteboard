import { Board } from "src/models/entities/board.entity";

export class ReturnUserDTO {
    id: number;
    username: string;
    boardsInvitations: Board[];

}