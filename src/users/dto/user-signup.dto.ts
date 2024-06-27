import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Roles } from "src/utility/common/user-roles-enum";
import { UserSignInDto } from "./user-signin.dto";

export class UserSignUpDto extends UserSignInDto {
    @IsNotEmpty({ message: "Name cannot be empty" })
    @IsString({ message: "Name must be a string" })
    name: string;
}