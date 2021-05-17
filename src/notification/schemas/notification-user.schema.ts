import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Notification } from './notification.schema';
import { Document } from 'mongoose';

export type NotificationUserLinkDocument = NotificationUserLink & Document;

@Schema()
export class NotificationUserLink {

  _id?:string;


  @Prop({ default: false })
  isReaded?: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
    required: true,
  })
  notification: Notification | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User | string;

  @Prop({ select: false })
  __v?: Number;
}

export const NotificationUserLinkSchema = SchemaFactory.createForClass(NotificationUserLink);