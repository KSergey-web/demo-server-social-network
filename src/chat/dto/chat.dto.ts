import { IsString, IsMongoId, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateChatDTO {
  avatar?: any;

  @MinLength(1)
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  users?: Array<string>;
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

export class AddUsersToChatDTO {
  @IsMongoId()
  @ApiProperty()
  chat: string;

  @ApiProperty()
  users: Array<string>;
}
