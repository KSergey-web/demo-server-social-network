import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as mongoose from 'mongoose';
import { Chat } from './chat.schema';

export type ChatUserDocument = ChatUser & Document;

@Schema()
export class ChatUser {

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  })
  chat: Chat;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ select: false })
  __v: Number;
}

export const ChatUserSchema = SchemaFactory.createForClass(ChatUser);
