import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { enumToArray } from 'src/utilities/user.decorator';
import { Organization } from '../../organization/schemas/organization.schema';
import { Task } from '../../task/schemas/task.schema';
import { Team } from '../../team/schemas/team.schema';
import { phaseEnum } from '../enums/phase.enum';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  _id?: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ enum: enumToArray(phaseEnum), required: true })
  phase: phaseEnum;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  })
  team: Team | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  })
  organization: Organization | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true })
  task: Task | string;

  @Prop({ select: false })
  __v?: Number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
