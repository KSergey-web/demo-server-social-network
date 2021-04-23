import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { AuthDto, CreateSocketDto } from './dto/socket.dto';
import { Socket, Server } from 'socket.io';
import { forwardRef, Inject, Logger, UseFilters } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { consoleOut } from 'src/debug';
import { IMessage } from 'src/message/interfaces/message.interface';
import { TaskDocument } from 'src/task/schemas/task.schema';
import { ObjectIdDTO } from 'src/shared/shared.dto';
import { Message } from 'src/message/schemas/message.schema';
import { User } from 'src/user/schemas/user.schema';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    @Inject(forwardRef(() => SocketService))
    private readonly socketService: SocketService) {
  }

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('SocketGateway');

  @SubscribeMessage('createSocket')
  create(@MessageBody() createSocketDto: CreateSocketDto) {
    return this.socketService.create(createSocketDto);
  }

  @SubscribeMessage('auth')
  auth(
    @MessageBody() createSocketDto: AuthDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.socketService.auth(client, createSocketDto);
  }

  @SubscribeMessage('msgToChat')
  handleMessage(message: Message): void {
    this.server.to((message.chat as string)).emit('msgFromChat', message);
  }

  @SubscribeMessage('leaveTeam')
  exitTeam(@MessageBody() dto: ObjectIdDTO, @ConnectedSocket() client: Socket) {
    this.logger.log(dto.id);
    this.socketService.clientLeaveRoom(client, dto.id);
  }

  @SubscribeMessage('enterTeam')
  enterTeam(
    @MessageBody() dto: ObjectIdDTO,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(dto.id);
    this.socketService.clientEnterRoom(client, dto.id);
  }

  newTask(task: TaskDocument): void {
    this.logger.log(task._id);
    this.server.to(task.team.toString()).emit('addedTask', task);
  }

  changedTask(task: TaskDocument): void {
    this.server.to(task.team.toString()).emit('changedTask', task);
  }

  taskChangedStatus(task: TaskDocument): void {
    this.server.to(task.team.toString()).emit('taskChangedStatus', task);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.socketService.clientDisconnect(client);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connectedEvent');
  }

  afterInit(server: Server){
    this.socketService.setServer(server);
  }
}
