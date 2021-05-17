import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as mongoose from 'mongoose';
import { Team } from './team.schema';

export type TeamUserLinkDocument = TeamUserLink & Document;

@Schema()
export class TeamUserLink {
  _id?: string;

  @Prop({ default: 'user' })
  roleUser: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  })
  team: Team | string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User | string;

  @Prop({ select: false })
  __v: Number;
}

export const TeamUserLinkSchema = SchemaFactory.createForClass(TeamUserLink);
