import {
  IsString,
  IsMongoId,
  MinLength,
  IsBoolean,
  IsEnum,
  IsDate,
  minLength,
  IsDateString,
  ValidateIf,
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
  description: string;

  @IsEnum(colorEnum)
  @ApiProperty()
  color: string;

  @IsMongoId()
  @ApiProperty()
  status: string;

  @IsMongoId()
  @ApiProperty()
  team: string;

  @ApiPropertyOptional()
  @ValidateIf(o => o.deadline != undefined)
  @IsDateString()
  deadline?: Date;
}

export class UpdateTaskDTO extends OmitType(PartialType(CreateTaskDTO), [
  'team',
] as const) {
  @ApiPropertyOptional()
  @ValidateIf(o => o.answer != undefined)
  @IsString()
  answer?: string;
}

export class ChangeStatusDTO {
  @IsMongoId()
  @ApiProperty()
  status: string;

  @IsMongoId()
  @ApiProperty()
  task: string;
}

export class DeleteFileFromTaskDTO {
  @IsMongoId()
  @ApiProperty()
  fileid: string;

  @IsMongoId()
  @ApiProperty()
  taskid: string;
}

export class AddAnswerDTO {
  @IsMongoId()
  @ApiProperty()
  task: string;

  @IsString()
  @ApiProperty()
  answer: string;
}

export class AddUserToTaskDTO {
  @IsMongoId()
  @ApiProperty()
  task: string;

  @IsMongoId()
  @ApiProperty()
  user: string;
}
