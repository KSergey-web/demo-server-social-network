import { Document } from 'mongoose';

export interface IMessage {
  _id?: string;

  text: string;

  date: Date;

  editing?: boolean;

  chat: string;

  user: string;
}
