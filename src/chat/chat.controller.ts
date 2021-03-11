import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { ObjectIdDTO } from 'src/shared/shared.dto';
import { UserDocument } from 'src/user/schemas/user.schema';
import { User } from 'src/utilities/user.decorator';
import { ChatService } from './chat.service';
import { AddChatUserDTO, CreateChatDTO } from './dto/chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  async createChat(
    @Body() createChatDTO: CreateChatDTO,
    @User() { _id }: UserDocument,
  ) {
    return await this.chatService.create(createChatDTO, _id);
  }

  @ApiBearerAuth()
  @Delete('leave/:id')
  @UseGuards(JwtAuthGuard)
  async leaveChat(@Param() params: ObjectIdDTO, @User() { _id }: UserDocument) {
    await this.chatService.leaveChat(params.id, _id);
    return 'you leave chat';
  }

  @ApiBearerAuth()
  @Get('add/:chat/:user')
  @UseGuards(JwtAuthGuard)
  async addUser(
    @Param() params: AddChatUserDTO,
    @User() { _id }: UserDocument,
  ) {
    await this.chatService.addUser(params, _id);
    return 'Worker is added to chat';
  }

  @ApiBearerAuth()
  @Get()
  @UseGuards(JwtAuthGuard)
  async getChats(@User() { _id }: UserDocument) {
    return await this.chatService.getChats(_id);
  }
}
