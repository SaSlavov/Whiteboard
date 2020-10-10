import { TestingModule, Test } from "@nestjs/testing";
import { AuthService } from "src/services/auth.service";
import { BoardsService } from "../services/boards.service";
import { AuthController } from "./auth.controller";
import { BoardsController } from "./boards.controller";

jest.mock('../services/boards.service.ts')

describe('Boards Controller', () => {
    let controller: BoardsController;
    let boardsMock: BoardsService;

    beforeEach(async () => {
        boardsMock = new BoardsService(undefined, undefined);
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BoardsController],
            providers: [
                {
                  provide: BoardsService,
                  useValue: boardsMock,
                }
              ]
        }).compile();

        controller = module.get<BoardsController>(BoardsController);

    })

    it('should be defined', () => {
        expect(controller).toBeDefined();
      });
})