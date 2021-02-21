import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[AuthModule, UserModule],
  providers: [SocketGateway, SocketService]
})
export class SocketModule {}
