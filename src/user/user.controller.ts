import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';
import { User } from '../utilities/user.decorator';
import { IUser } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

   @UseGuards(JwtAuthGuard)
   @Get()
   getProfile(@User() user: IUser) {
     return {user};
   }
} 
