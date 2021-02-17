import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Organization } from './organization.schema';
import { User } from '../../user/schemas/user.schema';

export type OrganizationUserDocument = OrganizationUser & Document;

@Schema()
export class OrganizationUser {

  @Prop( {default: 'worker'})
  roleUser: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true })
  organization: Organization;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop( {select: false})
  __v: Number;
}

export const OrganizationUserSchema = SchemaFactory.createForClass(OrganizationUser);