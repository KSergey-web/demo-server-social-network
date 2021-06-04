import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { genderEnum } from '../enums/gender.enum';
import * as bcrypt from 'bcrypt';
import { userStatusEnum } from 'src/socket/enums/socket.enum';
import { FileResource } from 'src/file-resource/schemas/group.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id?: string;

  status?: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  login: string;

  @Prop({ select: false })
  __v: Number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true })
  patronymic: string;

  @Prop({ required: true })
  birthdate: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FileResource',
    required: true,
  })
  avatar: FileResource;

  /*
  @Prop({ required: true, enum: Object.values(genderEnum) })
  gender: string;
  */

  @Prop({ default: null })
  telephone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function(next: mongoose.HookNextFunction) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
