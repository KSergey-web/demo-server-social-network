import { Document } from 'mongoose';

export interface IMessage {
  message: string;
  
  date: Date;

  editing?: boolean;

  chat: string;

  user: string;

}
