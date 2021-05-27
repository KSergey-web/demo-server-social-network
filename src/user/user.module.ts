import { forwardRef, Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { FileResourceModule } from 'src/file-resource/file-resource.module';
import { SocketModule } from 'src/socket/socket.module';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    forwardRef(() => SocketModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    FileResourceModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
