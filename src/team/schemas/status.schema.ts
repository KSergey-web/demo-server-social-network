import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Organization } from 'src/organization/schemas/organization.schema';
import { Team } from './team.schema';

export type StatusDocument = Status & Document;

@Schema()
export class Status {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  position: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  })
  team: Team;

  @Prop({ select: false })
  __v: Number;
}

export const StatusSchema = SchemaFactory.createForClass(Status);
