import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: any) {
    const payload = { login: user.login, sub: user.userId };
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: any) {
    //Сюда передаются данные декодированного токена
    return await this.userService.findByPayload(payload);
  }

  async verifyUser(token: any) {
    const payload = this.jwtService.verify(token);
    const user = await this.userService.findByPayload(payload);
    return user;
  }
}
