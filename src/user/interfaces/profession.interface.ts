import { Document } from 'mongoose';

export interface IProfession extends Document {
  readonly organization: string;

  readonly position: string;
}
