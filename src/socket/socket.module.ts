import { forwardRef, Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChatService } from 'src/chat/chat.service';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [AuthModule, forwardRef(() => ChatModule)],
  providers: [SocketGateway, SocketService],
  exports: [SocketService, SocketGateway],
})
export class SocketModule {}
