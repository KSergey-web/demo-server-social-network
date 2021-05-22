import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString, MinDate, MinLength } from 'class-validator';

export class ObjectIdDTO {
  @ApiProperty()
  @IsMongoId()
  id: string;
}

export enum avatarTypeEnum{
  mini = 'mini',
  average = 'average',
  original = 'original',
}

export class AvatarTypeDTO {
  @ApiPropertyOptional()
  @IsEnum(avatarTypeEnum)
  @IsOptional()
  avatartype: avatarTypeEnum;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  fileName: string;
}
