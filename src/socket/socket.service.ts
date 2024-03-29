import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from 'src/chat/chat.service';
import { IChat } from 'src/chat/interfaces/chat.interface';
import { Chat } from 'src/chat/schemas/chat.schema';
import { consoleOut } from 'src/debug';
import { AuthDto, CreateSocketDto } from './dto/socket.dto';
import { MapNotStrict } from './mapnotstrict.class';

@Injectable()
export class SocketService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  server: Server;

  create(createSocketDto: CreateSocketDto) {
    return 'This action adds a new socket';
  }

  private usersOnline = new MapNotStrict();

  private logger: Logger = new Logger('SocketService');

  async auth(client: Socket, auth: AuthDto) {
    const token = auth.token;
    try {
      const user = await this.authService.verifyUser(token);
      this.usersOnline.set(user._id, client.id);
      consoleOut(this.usersOnline, 'users online after auth');
      this.addClientToRooms(client, user._id);
    } catch (err) {
      client.emit('errorAuth', { message: token });
      this.logger.error(`Invalid token: ${token}`);
    }
    return;
  }

  async addClientToRooms(client: Socket, userid: string) {
    const chats: Array<IChat> = await this.chatService.getChats(userid);
    chats.forEach(function(chat, i, arr) {
      client.join(chat._id.toString());
    });
  }

  addUserToRoom(userid: string, room: string) {
    const client = this.getClient(userid);
    if (!client) return;
    client.join(room);
    consoleOut(client.rooms, `rooms of user ${userid}`);
    return;
  }

  deleteUserFromRoom(userid: any, room: any) {
    const client = this.getClient(userid);
    if (!client) return;
    client.leave(room);
    return;
  }

  getClient(userid: any): Socket | null {
    if (!this.usersOnline.has(userid)) {
      this.logger.log(`user with id ${userid} offline`);
      return null;
    }
    return this.server.sockets.connected[this.usersOnline.get(userid).value];
  }

  clientLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    setTimeout(
      () =>
        consoleOut(client.rooms, `leave ${room}. rooms of client ${client.id}`),
      1,
    );
    return;
  }

  clientEnterRoom(client: Socket, room: string) {
    client.join(room);
    setTimeout(
      () =>
        consoleOut(client.rooms, `enter ${room}. rooms of user ${client.id}`),
      1,
    );
    return;
  }

  clientDisconnect(client: Socket) {
    client.leaveAll();
    this.usersOnline.deleteByValue(client.id);
    return;
  }

  newNotificationEvent(userId: string) {
    const client = this.getClient(userId);
    if (!client) return;
    client.emit('newNotification');
  }
}
