import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as mongoose from 'mongoose';
import { Group } from './Group.schema';

export type GroupUserLinkDocument = GroupUserLink & Document;

@Schema()
export class GroupUserLink {
  @Prop({ default: 'user' })
  roleUser: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  })
  group: Group;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ select: false })
  __v: Number;
}

export const GroupUserLinkSchema = SchemaFactory.createForClass(GroupUserLink);
