import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcryptjs';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

import * as dotenv from 'dotenv';
dotenv.config();

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
  
  async signin(userSignInDto: UserSignInDto): Promise<UserEntity> {// Debug log to check if the method is called
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: userSignInDto.email })
      .getOne();
    
    if (!user || !(await bcrypt.compare(userSignInDto.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    return this.sanitizeUser(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

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
    return sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRE_TIME }
    );
  }
}