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
  @ApiPropertyOptional()
  @IsOptional()
  image?: string;

  @IsString()
  @IsMongoId()
  @ApiProperty()
  group: string;
}

export class UpdatePostDTO extends OmitType(PartialType(CreatePostDTO), [
  'group',
] as const) {}
