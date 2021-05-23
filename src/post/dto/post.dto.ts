import { IsString, IsMongoId, MinLength, IsOptional } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';

export class CreatePostDTO {
  @MinLength(1)
  @ApiProperty()
  text: string;

  @IsString()
  @IsMongoId()
  @ApiProperty()
  group: string;

  @ApiPropertyOptional()
  @IsOptional()
  files: any;
}

export class UpdatePostDTO extends OmitType(PartialType(CreatePostDTO), [
  'group',
] as const) {}
