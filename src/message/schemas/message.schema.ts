import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as mongoose from 'mongoose';
import { Chat } from 'src/chat/schemas/chat.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: false })
  editing: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  })
  chat: Chat | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User | string;

  @Prop({ select: false })
  __v: Number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
