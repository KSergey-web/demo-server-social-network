import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { consoleOut } from 'src/debug';
import { MessageService } from 'src/message/message.service';
import { ObjectIdDTO } from 'src/shared/shared.dto';
import { UserDocument } from 'src/user/schemas/user.schema';
import { User } from 'src/utilities/user.decorator';
import { ChatService } from './chat.service';
import {
  AddChatUserDTO,
  AddUsersToChatDTO,
  CreateChatDTO,
} from './dto/chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
  ) {}

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
  @Get(':chat/add/:user')
  @UseGuards(JwtAuthGuard)
  async addUser(
    @Param() params: AddChatUserDTO,
    @User() { _id }: UserDocument,
  ) {
    await this.chatService.addUser(params, _id);
    return 'Worker is added to chat';
  }

  @ApiBearerAuth()
  @Post('addUsers')
  @UseGuards(JwtAuthGuard)
  async addUsers(
    @Body() dto: AddUsersToChatDTO,
    @User() { _id }: UserDocument,
  ) {
    dto.users.forEach(async userId => {
      await this.chatService.addUser({ chat: dto.chat, user: userId }, _id);
    });
    return { message: 'Workers is added to chat' };
  }

  @ApiBearerAuth()
  @Get(':id/users')
  @UseGuards(JwtAuthGuard)
  async getUsers(@Param() params: ObjectIdDTO, @User() { _id }: UserDocument) {
    const links = await this.chatService.getChatUserLinksByChat(params.id, _id);
    let users: Array<any> = [];
    links.forEach(link => {
      users.push(link.user);
    });
    return users;
  }

  @ApiBearerAuth()
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getChats(@User() { _id }: UserDocument) {
    let chats: any = await this.chatService.getChats(_id);
    let newArray = [];
    for (let i = 0; i < chats.length; ++i) {
      newArray.push({
        ...chats[i].toObject(),
        message: await this.messageService.lastFromChat(chats[i]._id),
      });
    }
    return newArray;
  }
}
