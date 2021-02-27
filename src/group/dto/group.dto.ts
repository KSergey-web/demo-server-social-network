import {
  IsString,
  IsMongoId,
  MinLength,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { roleUserGroupEnum } from '../enums/role-user.enum';

export class CreateGroupDTO {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  avatar: string;

  @IsBoolean()
  @ApiProperty()
  isOpened: Boolean;
}

export class UpdateGroupDTO extends PartialType(CreateGroupDTO) {}

export class AddGroupUserLinkDTO {
  @IsMongoId()
  @ApiProperty()
  group: string;

  @IsMongoId()
  @ApiProperty()
  user: string;

  @IsEnum(roleUserGroupEnum)
  @ApiPropertyOptional()
  roleUser?: string;
}

export class DeleteGroupUserLinkDTO {
  @IsMongoId()
  @ApiProperty()
  user: string;

  @IsMongoId()
  @ApiProperty()
  group: string;
}
