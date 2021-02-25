import { IsString, IsMongoId, MinLength, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

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
