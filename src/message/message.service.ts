import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatService } from 'src/chat/chat.service';
import { CreateMessageDTO } from './dto/message.dto';
import { IMessage } from './interfaces/message.interface';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name)
        private messageModel: Model<MessageDocument>,
        private readonly chatService: ChatService,
      ) {}
    
      async create(createMessageDTO: CreateMessageDTO, userid: any) {
        await this.chatService.checkChatById(createMessageDTO.chat);
        await this.chatService.chatUserLink(createMessageDTO.chat, userid);
        const message: IMessage = {
            ...createMessageDTO,
            date: new Date(),
            user: userid,
          };
        const createdMessage = new this.messageModel(message);
        return await createdMessage.save();
      }
}