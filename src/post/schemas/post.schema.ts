import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Group } from 'src/group/schemas/Group.schema';
import { User } from 'src/user/schemas/user.schema';
import * as mongoose from 'mongoose';
import { FileResource } from 'src/file-resource/schemas/group.schema';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  date: Date;

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

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FileResource' }],
    default: [],
  })
  files: FileResource[];

  @Prop({ select: false })
  __v: Number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
