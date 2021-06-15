import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { consoleOut } from 'src/debug';
import { FileResourceService } from 'src/file-resource/file-resource.service';
import { MessageService } from 'src/message/message.service';
import { User } from 'src/user/schemas/user.schema';
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
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly fileResourceService: FileResourceService,
  ) {}

  async create(chatDTO: CreateChatDTO, userId: string) {
    chatDTO.avatar = await this.fileResourceService.saveAvatar(chatDTO.avatar);
    const createdChat = new this.chatModel(chatDTO);
    await createdChat.save();
    const chatUser: IChatUser = {
      chat: createdChat._id,
      user: userId,
    };
    const createdChatUser = new this.chatUserModel(chatUser);
    await createdChatUser.save();
    this.socketService.addUserToRoom(userId, createdChat._id );
    if (chatDTO.users) {
      chatDTO.users.forEach(async user => {
        await this.addUser({ chat: createdChat._id, user }, userId);
      });
    }
    return createdChat;
  }

  async checkExistPrivateChat(userId: any, userIdme: any){
    const links = await this.chatUserModel.find({user: userIdme}).populate('chat').exec();
    for (let i = 0; i < links.length; ++i ){
      if (links[i].chat.isPrivate) {
        let check = await this.chatUserModel.findOne({user:userId, chat: links[i].chat});
        if (check) return links[i].chat; 
      }
    }
    return false
  }

  async createPrivateChat(userId: string, userIdme: string){
    const ch = await this.checkExistPrivateChat(userId, userIdme) 
    if (ch){
      await this.getPrivateChat(ch, userIdme);
      return ch;
    }
    const createdChat = new this.chatModel({name:'def', avatar: 'def', isPrivate: true});
    await createdChat.save();
    const chatUser: IChatUser = {
      chat: createdChat._id,
      user: userId,
    };
    const chatUser2: IChatUser = {
      chat: createdChat._id,
      user: userIdme,
    };
    const createdChatUser = new this.chatUserModel(chatUser);
    await createdChatUser.save();
    const createdChatUser2 = new this.chatUserModel(chatUser2);
    await createdChatUser2.save();
    this.socketService.addUserToRoom(userId, createdChat._id );
    this.socketService.addUserToRoom(userIdme, createdChat._id );
    await this.getPrivateChat(createdChat, userIdme);
    return createdChat;
  }

  async getPrivateChat(chat: any, userId: any){
    const link = await this.chatUserModel.findOne({chat:chat._id as any, user:{ $ne: userId}}).populate('user').exec();
    if (!link) return;
    chat.name = link.user.surname + " " + link.user.name;
    chat.avatar = link.user.avatar.toString();
    return chat;
  }

  async checkChatById(id: string): Promise<ChatDocument> {
    const chat = await this.chatModel.findById(id);
    if (!chat) {
      throw new HttpException('Chat not found', HttpStatus.BAD_REQUEST);
    }
    return chat;
  }

  async chatUserLink(chatid: any, userid: any): Promise<ChatUserDocument> {
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
    const link = await this.chatUserLink(chatid, userid);
    await link.deleteOne();
    this.socketService.deleteUserFromRoom(link.user, link.chat);
    return;
  }

  async addUser(addChatUserDTO: AddChatUserDTO, userid: any) {
    const chatid: any = addChatUserDTO.chat;
    await this.checkChatById(chatid);
    await this.chatUserModel.findOne({
      user: userid,
      chat: chatid,
    });
    await this.userService.checkUserById(addChatUserDTO.user);
    const createdChatUser = new this.chatUserModel(addChatUserDTO);
    await createdChatUser.save();
    this.socketService.addUserToRoom(addChatUserDTO.user, chatid);
    return;
  }

  async getChats(userid: any): Promise<Array<Chat>> {
    const links = await this.chatUserModel
      .find({
        user: userid,
      })
      .populate('chat');
    let chats: Array<Chat> = [];
    for( let i = 0; i < links.length; ++i){
      
      if (links[i].chat.isPrivate){
        chats.push(await this.getPrivateChat(links[i].chat as any, userid));
      }
      else 
      chats.push(links[i].chat);
    }
    return chats;
  }

  async getChatUserLinksByChat(
    chatId: string,
    userId: string,
  ): Promise<Array<ChatUserDocument>> {
    await this.checkChatById(chatId);
    await this.chatUserLink(chatId, userId);
    return await this.chatUserModel
      .find({ chat: chatId as any })
      .populate('user')
      .exec();
  }
}
