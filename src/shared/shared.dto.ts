import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MinDate,
  MinLength,
} from 'class-validator';

export class ObjectIdDTO {
  @ApiProperty()
  @IsMongoId()
  id: string;
}
