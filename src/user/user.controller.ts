import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { IUser } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  
  @Get()
  async test() {
    return this.userService.create({login: "sergey", password:"6324ab"});
  }

  @UseGuards(JwtAuthGuard)
   @Get('check')
   getProfile(@Request() req) {
     return req.user;
   }
} 
