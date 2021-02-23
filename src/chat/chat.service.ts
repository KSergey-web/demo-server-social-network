import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { consoleOut } from 'src/debug';
import { UserService } from 'src/user/user.service';
import { SocketService } from '../socket/socket.service';
import { AddChatUserDTO, CreateChatDTO } from './dto/chat.dto';
import { IChat, IChatUser } from './interfaces/chat.interface';
import { ChatUser, ChatUserDocument } from './schemas/chat-user.schema';
import { Chat, ChatDocument } from './schemas/chat.schema';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name)
        private chatModel: Model<ChatDocument>,
        @InjectModel(ChatUser.name)
        private chatUserModel: Model<ChatUserDocument>,
        @Inject(forwardRef(() => SocketService))
        private readonly socketService: SocketService,
        private readonly userService: UserService
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
        await link.deleteOne();
        this.socketService.deleteUserFromRoom(link.user, link.chat);
         return;
    }

    async addUser( addChatUserDTO: AddChatUserDTO, userid: any) {
        const chatid: any = addChatUserDTO.chat
        await this.checkChatById(chatid);
        await this.chatUserModel.findOne({
          user: userid,
          chat: chatid,
        });
        await this.userService.checkUserById(addChatUserDTO.user);
        const createdChatUser = new this.chatUserModel(addChatUserDTO);
        await createdChatUser.save();
        this.socketService.addUserToRoom(addChatUserDTO.user,chatid);
        return ;
    }

    async getChats(userid: any):  Promise<Array<IChat>> {
      const links = await this.chatUserModel.find({
        user: userid
      }).populate('chat');
      let chats: Array<IChat> = [];
      links.forEach(function (item, i, arr) {
      chats.push(item.chat);
      });
      return chats;
  }
}
