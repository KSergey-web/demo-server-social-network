import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";

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
    @IsMongoId()
    file: string;
  }