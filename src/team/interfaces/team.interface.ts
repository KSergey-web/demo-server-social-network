import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface ITeam {
  _id?: string;

  name: string;

  avatar: string;

  organization: string;
}

export interface ITeamUserLink {
  roleUser?: string;

  team: string;

  user: string;
}
