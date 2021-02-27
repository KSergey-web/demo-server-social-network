import {
  IsString,
  IsMongoId,
  MinLength,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { roleUserTeamEnum } from '../enums/role-user.enum';

export class CreateTeamDTO {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  avatar: string;

  @IsString()
  @ApiProperty()
  organization: string;
}

export class UpdateTeamDTO extends OmitType(PartialType(CreateTeamDTO), [
  'organization',
] as const) {}

export class AddTeamUserLinkDTO {
  @IsMongoId()
  @ApiProperty()
  team: string;

  @IsMongoId()
  @ApiProperty()
  user: string;

  @IsEnum(roleUserTeamEnum)
  @ApiPropertyOptional()
  roleUser?: string;
}

export class DeleteTeamUserLinkDTO {
  @IsMongoId()
  @ApiProperty()
  user: string;

  @IsMongoId()
  @ApiProperty()
  team: string;
}
