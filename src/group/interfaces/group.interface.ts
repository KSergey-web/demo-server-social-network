import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface IGroup {
  name: string;

  description: string;

  avatar: string;

  isOpen: Boolean;

  organization: string;
}

export interface IGroupUserLink {
  roleUser?: string;

  group: string;

  user: string;
}
