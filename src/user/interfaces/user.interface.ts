import { Document } from 'mongoose';
import { IProfession } from './profession.interface';

export interface IUser extends Document {
  readonly email: string;

  readonly name: string;

  readonly surname: string;

  readonly patronymic: string;

  readonly gender: string;

  readonly birthdate: Date;

  readonly login: string;

  readonly password: string;

  readonly avatar: string;

  readonly telephone: string;

  readonly profession: [IProfession];
}
