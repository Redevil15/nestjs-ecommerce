import { IsNotEmpty, IsString } from "class-validator";
import { UserSignInDto } from "./user-signin.dto";

export class UserSignUpDto extends UserSignInDto {
    @IsNotEmpty({ message: "Name cannot be empty" })
    @IsString({ message: "Name must be a string" })
    name: string;
}