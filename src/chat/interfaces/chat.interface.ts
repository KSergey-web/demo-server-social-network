import { Document } from 'mongoose';

export interface IChat {
  avatar: string;

  name: string;

}

export interface IChatUser {
  user: string;

  chat: string;

}