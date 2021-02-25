import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';
import { User } from '../utilities/user.decorator';
import { UpdateUserDTO } from './dto/user.dto';
import { IUser } from './interfaces/user.interface';
import { UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  currentUser(@User() user: UserDocument) {
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() userDTO: UpdateUserDTO, @User() user: UserDocument) {
    return this.userService.updateUser(userDTO, user);
  }
}
