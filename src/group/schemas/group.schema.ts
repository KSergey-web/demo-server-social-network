import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Organization } from 'src/organization/schemas/organization.schema';

export type GroupDocument = Group & Document;

@Schema()
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  isOpen: Boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  })
  organization: Organization | string;

  @Prop({ select: false })
  __v: Number;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
