import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface IOrganization extends Document {
  name: string;

  description: string;

  avatar: string;
}

export interface IOrganizationUser {
  roleUser?: string;

  organization: string;

  user: string;
}
