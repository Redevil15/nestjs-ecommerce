import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

interface JwtPayload{
  id: string;
}

declare global{
  namespace Express {
    interface Request {
      currentUser?: UserEntity;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor( private readonly _userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log('authHeader', authHeader);
    if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')){
      req.currentUser = null;
      next();
    } else {
      const token = authHeader.split(' ')[1];
      const { id } = <JwtPayload>verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
      const currentUser = await this._userService.findOne(+id);
      req.currentUser = currentUser;
      next();
    }
  }
}


