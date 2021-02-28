import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface ITeam {
  _id?: string;

  name: string;

  discription: string;

  color: string;

  deadline: Date;

  team: string;

  status: string;

  users: string[];
}
