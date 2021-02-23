import { Document } from 'mongoose';

export interface IChat {
  _id?: string;
  
  avatar: string;

  name: string;

}

export interface IChatUser {
  user: string;

  chat: string;

}