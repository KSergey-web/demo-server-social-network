import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { MessageService } from './message.service';
import { User } from '../utilities/user.decorator';
import { UserDocument } from 'src/user/schemas/user.schema';
import { CreateMessageDTO } from './dto/message.dto';
import { ObjectIdDTO } from 'src/shared/shared.dto';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  async createMessage(
    @Body() createMessageDTO: CreateMessageDTO,
    @User() user: UserDocument,
  ) {
    return await this.messageService.create(createMessageDTO, user._id);
  }

  @ApiBearerAuth()
  @Get('all/chat/:id')
  @UseGuards(JwtAuthGuard)
  async getMessagesFromChat(
    @Param() params: ObjectIdDTO,
    @User() user: UserDocument,
  ) {
    return await this.messageService.getMessagesFromChat(params.id, user._id);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteMessage(
    @Param() params: ObjectIdDTO,
    @User() user: UserDocument,
  ) {
    //
  }


  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateMessage(
    @Param() params: ObjectIdDTO,
    @User() user: UserDocument,
  ) {
    //
  }
}
