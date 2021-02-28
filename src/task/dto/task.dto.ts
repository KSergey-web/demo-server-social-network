import {
  IsString,
  IsMongoId,
  MinLength,
  IsBoolean,
  IsEnum,
  IsDate,
  minLength,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { colorEnum } from '../enums/color.enum';

export class CreateTaskDTO {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  discription: string;

  @IsEnum(colorEnum)
  @ApiProperty()
  color: string;

  @IsMongoId()
  @ApiProperty()
  status: string;

  @IsMongoId()
  @ApiProperty()
  team: string;

  @IsDate()
  @ApiPropertyOptional()
  deadline?: Date;
}

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {}

export class ChangeStatusDTO {
  @IsMongoId()
  @ApiProperty()
  team: string;

  @IsMongoId()
  @ApiProperty()
  status: string;

  @IsMongoId()
  @ApiProperty()
  task: string;
}

export class AddAnswerDTO {
  @IsMongoId()
  @ApiProperty()
  task: string;

  @IsString()
  @MinLength(2)
  @ApiProperty()
  answer: string;
}
