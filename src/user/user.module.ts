import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profession, ProfessionSchema } from './schemas/profession.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Profession.name, schema: ProfessionSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
