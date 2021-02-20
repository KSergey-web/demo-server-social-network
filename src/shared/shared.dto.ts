import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class ObjectIdDTO {
  @ApiProperty()
  @IsMongoId()
  id: string;
}
