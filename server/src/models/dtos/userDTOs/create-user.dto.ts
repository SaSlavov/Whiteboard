import { Length } from "class-validator";

export class CreateUserDTO {
    @Length(4, 23)
    username: string;
    @Length(5)
    password: string;
    email: string;
}