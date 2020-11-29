import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { genderEnum } from '../enums/gender.enum';
import { Profession } from './profession.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true })
  patronymic: string;

  @Prop({ required: true, enum: Object.values(genderEnum) })
  gender: string;

  @Prop({ required: true })
  birthdate: Date;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({ default: null })
  telephone: string;

  @Prop()
  profession: [Profession];
}

export const UserSchema = SchemaFactory.createForClass(User);
