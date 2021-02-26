import { IsString, IsMongoId, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateChatDTO {
  @IsString()
  @ApiProperty()
  avatar: string;

  @MinLength(1)
  @ApiProperty()
  name: string;
}

export class UpdatChatDTO extends PartialType(CreateChatDTO) {}

export class AddChatUserDTO {
  @IsMongoId()
  @ApiProperty()
  user: string;

  @IsMongoId()
  @ApiProperty()
  chat: string;
}
