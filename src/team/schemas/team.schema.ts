import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Organization } from 'src/organization/schemas/organization.schema';

export type TeamDocument = Team & Document;

@Schema()
export class Team {
  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  })
  organization: Organization | string;

  @Prop({ select: false })
  __v: Number;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
