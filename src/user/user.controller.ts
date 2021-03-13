import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ObjectIdDTO } from 'src/shared/shared.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';
import { User } from '../utilities/user.decorator';
import { UpdateUserDTO } from './dto/user.dto';
import { IUser } from './interfaces/user.interface';
import { UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  currentUser(@User() {_id}: UserDocument) {
    return this.userService.checkUserById(_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() userDTO: UpdateUserDTO, @User() user: UserDocument) {
    return this.userService.updateUser(userDTO, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUser(@Param() params:ObjectIdDTO) {
    return this.userService.checkUserById(params.id);
  }
}
