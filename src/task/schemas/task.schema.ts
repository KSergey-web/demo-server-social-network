import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Team } from 'src/team/schemas/team.schema';
import { Status } from 'src/team/schemas/status.schema';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  _id?:string;
  
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  color: string;

  @Prop({ default: null })
  deadline: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
    required: true,
  })
  status: Status;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  })
  team: Team | string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  users: User[];

  @Prop({ default: '' })
  answer: string;

  @Prop({ select: false })
  __v: Number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
