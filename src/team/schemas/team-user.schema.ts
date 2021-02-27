import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as mongoose from 'mongoose';
import { Team } from './team.schema';

export type TeamUserLinkDocument = TeamUserLink & Document;

@Schema()
export class TeamUserLink {
  @Prop({ default: 'user' })
  roleUser: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  })
  team: Team;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ select: false })
  __v: Number;
}

export const TeamUserLinkSchema = SchemaFactory.createForClass(TeamUserLink);
