import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { MessageService } from './message.service';
import { User } from '../utilities/user.decorator';
import { UserDocument } from 'src/user/schemas/user.schema';
import { CreateMessageDTO } from './dto/message.dto';

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
}
