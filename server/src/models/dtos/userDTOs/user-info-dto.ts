import { UserRole } from "src/models/enums/user-role";

export class UserInfoDTO {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;

}