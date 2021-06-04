import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { UserModule } from 'src/user/user.module';
import { ChatUser, ChatUserSchema } from './schemas/chat-user.schema';
import { SocketModule } from '../socket/socket.module';
import { MessageModule } from 'src/message/message.module';
import { FileResourceModule } from 'src/file-resource/file-resource.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: ChatUser.name, schema: ChatUserSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => MessageModule),
    forwardRef(() => SocketModule),
    FileResourceModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
