import { Document } from 'mongoose';
import { genderEnum } from '../enums/gender.enum';

export interface IUser extends Document {
  //readonly email: string;

  
  readonly password: string;

  login: string;

 /* readonly name: string;

  readonly surname: string;

  readonly patronymic: string;

  readonly gender: string;

  readonly birthdate: Date;

  readonly login: string;

  readonly password: string;

  readonly avatar: string;

  readonly telephone: string;*/
}
