import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { User } from 'src/utilities/user.decorator';
import { IUser } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

   @UseGuards(JwtAuthGuard)
   @Get()
   getProfile(@User() user: IUser) {
     console.log(user);
     return {user};
   }
} 
