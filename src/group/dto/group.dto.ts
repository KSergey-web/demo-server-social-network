import {
  IsString,
  IsMongoId,
  MinLength,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsBooleanString,
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

  @IsBooleanString()
  @ApiProperty()
  isOpen: string;

  @IsMongoId()
  @ApiProperty()
  organization: string;

  avatar?: any;
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
  @IsOptional()
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
