import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { consoleOut } from 'src/debug';
import { AddChatUserDTO, CreateChatDTO } from './dto/chat.dto';
import { IChatUser } from './interfaces/chat.interface';
import { ChatUser, ChatUserDocument } from './schemas/chat-user.schema';
import { Chat, ChatDocument } from './schemas/chat.schema';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name)
        private chatModel: Model<ChatDocument>,
        @InjectModel(ChatUser.name)
        private chatUserModel: Model<ChatUserDocument>,
      ) {}
      
      async create(chatDTO: CreateChatDTO, userid: string) {
        const createdChat = new this.chatModel(chatDTO);
        await createdChat.save();
        const chatUser: IChatUser = {
          chat: createdChat._id,
          user: userid,
        };
        const createdChatUser = new this.chatUserModel(
          chatUser
        );
        await createdChatUser.save();
        return createdChat;
      }
    
    
      async checkChatById(id: string): Promise<ChatDocument> {
        const chat = await this.chatModel.findById(id);
        if (!chat) {
          throw new HttpException('Chat not found', HttpStatus.BAD_REQUEST);
        }
        return chat;
      }

      async chatUserLink(
        chatid: any,
        userid: any,
      ): Promise<ChatUserDocument> {
        const link = await this.chatUserModel.findOne({
          user: userid,
          chat: chatid,
        });
        if (!link) {
          throw new HttpException(
            'You do not have this Chat',
            HttpStatus.UNAUTHORIZED,
          );
        }
        return link;
      }

      async leaveChat(chatid: string, userid: string) {
        const link = await this.chatUserLink(
          chatid,
          userid,
        );
       return await link.deleteOne();
    }

    async addUser( addChatUserDTO: AddChatUserDTO, userid: any) {
        const chatid: any = addChatUserDTO.chat
        await this.checkChatById(chatid);
        await this.chatUserModel.findOne({
          user: userid,
          chat: chatid,
        });
        const createdChatUser = new this.chatUserModel(addChatUserDTO);
        return await createdChatUser.save();
    }
}
