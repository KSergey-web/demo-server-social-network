import {
  IsString,
  IsMongoId,
  MinLength,
  IsEnum,
  isNumberString,
  Min,
  IsInt,
  Max,
  ValidateIf,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { directionEnum, roleUserTeamEnum } from '../enums/role-user.enum';

export class CreateTeamDTO {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  name: string;

  avatar?: any;

  @IsString()
  @ApiProperty()
  organization: string;

  @ApiPropertyOptional()
  users?: Array<string>;
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

  @ValidateIf(o => o.roleUser != undefined)
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

export class AddStatusDTO {
  @IsString()
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @ApiProperty()
  currentPosition: number;

  @IsEnum(directionEnum)
  @ApiProperty()
  direction: directionEnum;

  @IsMongoId()
  @ApiProperty()
  team: string;
}

export class DeleteStatusDTO {
  @IsMongoId()
  @ApiProperty()
  team: string;

  @IsMongoId()
  @ApiProperty()
  status: string;
}
