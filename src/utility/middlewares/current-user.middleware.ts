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
      return;  // Unauthorized error if no token is found or invalid token is provided. 401 Unauthorized HTTP status code is used. 403 Forbidden HTTP status code is used for permission denied. 404 Not Found HTTP status code is used for not found resources. 405 Method Not Allowed HTTP status code is used for unsupported HTTP methods. 415 Unsupported Media Type HTTP status
    } else {
      try {
        const token = authHeader.split(' ')[1];
        const { id } = <JwtPayload>verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        const currentUser = await this._userService.findOne(+id);
        req.currentUser = currentUser;
        next();
      } catch (error) {
        req.currentUser = null;
        next();
      }
    }
  }
}


