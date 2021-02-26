import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Group } from 'src/group/schemas/Group.schema';
import { User } from 'src/user/schemas/user.schema';
import * as mongoose from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: false })
  image: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  })
  group: Group;

  @Prop({ select: false })
  __v: Number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
