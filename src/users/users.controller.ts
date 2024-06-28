import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() userSignUp: UserSignUpDto): Promise<UserEntity> {
    console.log('holaregistrar')
    return await this.usersService.signup(userSignUp);
  }

  @Post('signin')
  async signin(@Body() userSignInDto: UserSignInDto): Promise<{ user: UserEntity, accessToken: string }> { // Debug log to check if the method is called
    const user = await this.usersService.signin(userSignInDto); 
    const accessToken = await this.usersService.generateJwtToken(user);

    return { accessToken, user };
  }

  @Get('allusers')
  async findAllUsers(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return await this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('me')
  async getProfile(@CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }
}