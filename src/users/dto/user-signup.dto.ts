import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Roles } from "src/utility/common/user-roles-enum";

export class UserSignUpDto {
    @IsNotEmpty({ message: "Name cannot be empty" })
    @IsString({ message: "Name must be a string" })
    name: string;

    @IsNotEmpty({ message: "Email cannot be empty" })
    @IsString({ message: "Email must be a string" })
    @IsEmail({}, { message: "Invalid email format" })
    email: string;

    @IsNotEmpty({ message: "Password cannot be empty" })
    @MinLength(6, { message: "Password must be at least 6 characters" })
    password: string;
}