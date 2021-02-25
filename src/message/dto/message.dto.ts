import { IsString, IsMongoId, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateMessageDTO {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  text: string;

  @IsMongoId()
  @ApiProperty()
  chat: string;
}

export class UpdateMessageDTO extends CreateMessageDTO {}
