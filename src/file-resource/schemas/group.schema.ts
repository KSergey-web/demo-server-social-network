import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type FileResourceDocument = FileResource & Document;

@Schema()
export class FileResource {
  _id?:string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  buffer?: string;

  @Prop({ select: false })
  __v?: Number;
}

export const FileResourceSchema = SchemaFactory.createForClass(FileResource);
