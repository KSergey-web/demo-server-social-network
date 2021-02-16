import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDTO, RegisterDTO } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.gaurd';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService, 
    private userService: UserService
    ) {}


   @Post('login')
   async login(@Body() userDTO: LoginDTO) {
     const user = await this.userService.findByLogin(userDTO);
     const payload = {
       login: user.login,
     };
     const token = await this.authService.login(payload);
     return { user, token };
   }
 
   @Post('register')
   async register(@Body() userDTO: RegisterDTO) {
     const user = await this.userService.create(userDTO);
     const payload = {
       login: user.login
     };
     const token = await this.authService.login(payload);
     return { user, token };
   }

   @UseGuards(JwtAuthGuard)
   @Get('check')
   getProfile(@Request() req) {
     return req.user;
   }
}
