import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { CreateSocketDto } from './dto/create-socket.dto';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly socketService: SocketService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    ) {}

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('SocketGateway'); 

  @SubscribeMessage('createSocket')
  create(@MessageBody() createSocketDto: CreateSocketDto) {
    return this.socketService.create(createSocketDto);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    const user = await this.authService.verifyUser(client.handshake.headers.authorization);
    !user && client.disconnect();
  }
}
