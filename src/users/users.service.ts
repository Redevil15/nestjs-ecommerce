import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcryptjs';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signup(userSignUp: UserSignUpDto): Promise<UserEntity> {
    if (await this.findUserByEmail(userSignUp.email)) {
      throw new BadRequestException('Email already exists');
    }

    userSignUp.password = await this.hashPassword(userSignUp.password);
    let user = this.userRepository.create(userSignUp);
    user = await this.userRepository.save(user);
    return this.sanitizeUser(user);
  }
  
  async signin( userSignInDto: UserSignInDto ): Promise<UserEntity> {
    const userExists = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', {email:userSignInDto.email})
      .getOne();
    
    if (!userExists || !(await bcrypt.compare(userSignInDto.password, userExists.password))) {
      throw new BadRequestException('Bad credentials');
    }

    return this.sanitizeUser(userExists);
  }



  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async findUserByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private sanitizeUser(user: UserEntity): UserEntity {
    const sanitizedUser = { ...user };
    delete sanitizedUser.password;
    return sanitizedUser;
  }

  async generateJwtToken(user: UserEntity): Promise<string> {
    // Implement JWT token generation logic here
    return sign({
      id: user.id, 
      email: user.email
    }, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRE_TIME})
  }

}
