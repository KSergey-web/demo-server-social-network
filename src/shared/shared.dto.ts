import { IsMongoId } from 'class-validator';

  export class ObjectIdDTO {
    @IsMongoId()
    id: string;
  }
