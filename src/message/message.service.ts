import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatService } from 'src/chat/chat.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { CreateMessageDTO } from './dto/message.dto';
import { IMessage } from './interfaces/message.interface';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
    @Inject(forwardRef(() => SocketGateway))
    private readonly socketGateway: SocketGateway,
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
    await createdMessage.save();
    await createdMessage.populate('user').execPopulate();
    this.socketGateway.handleMessage(createdMessage);
    return createdMessage;
  }

  async getMessagesFromChat(
    chat: any,
    user: any,
    page: number = 1,
  ): Promise<Array<Message>> {
    await this.chatService.checkChatById(chat);
    await this.chatService.chatUserLink(chat, user);
    return await this.messageModel
      .find({ chat })
      .sort({ date: 1 })
      .skip((page - 1) * 20)
      .limit(20)
      .populate('user')
      .exec();
  }

  async lastFromChat(chat: any): Promise<Message> {
    const mes = await this.messageModel
      .find({ chat: chat })
      .sort({ date: -1 })
      .limit(1)
      .populate('user')
      .exec();
    return mes.pop();
  }
}
