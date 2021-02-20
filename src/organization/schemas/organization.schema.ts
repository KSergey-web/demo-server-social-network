import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema()
export class Organization {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ select: false })
  __v: Number;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
