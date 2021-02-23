import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from 'src/chat/chat.service';
import { IChat } from 'src/chat/interfaces/chat.interface';
import { Chat } from 'src/chat/schemas/chat.schema';
import { AuthDto, CreateSocketDto } from './dto/socket.dto';

@Injectable()
export class SocketService {
  constructor(
    private readonly authService: AuthService,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
    ) {}
    
  @WebSocketServer() server: Server;

  create(createSocketDto: CreateSocketDto) {
    return 'This action adds a new socket';
  }

  private usersOnline = new Map();

  private logger: Logger = new Logger('SocketService'); 
  
  async auth(client: Socket, auth: AuthDto) {
    const token = auth.token;
    try{
    const user = await this.authService.verifyUser(token);
    this.usersOnline.set(user._id, client.id);
    this.logger.log( `auth ${this.usersOnline.get(user._id)}`);
    this.addClientToRooms(client, user._id);
    } catch (err) {
      this.logger.error(`Invalid token: ${token}`);
    };
    return;
  }

  async addClientToRooms(client: Socket, userid: string) {
    const chats: Array<IChat> = await this.chatService.getChats(userid);
    chats.forEach(function (chat, i, arr) {
      client.join(chat._id);
      });
  }

  addUserToRoom(userid: string, chatid: string) {
    const client = this.getClient(userid);
    if (!client) return;
    client.join(chatid);
    return;
  }

  deleteUserFromRoom(userid: any, chatid: any) {
    const client = this.getClient(userid);
    if (!client) return;
    client.leave(chatid);
    return;
  }

  getClient(userid: any){
    if (!this.usersOnline.has(userid)) {
      this.logger.log(`user with id ${userid} offline`);
      return null;
    };
    return this.server.sockets.connected[this.usersOnline.get(userid)];
  }
}
