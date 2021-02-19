import {
  IsString,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class CreateOrganizationDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  avatar: string;
}

export class FireUserDTO {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  organizationId: string
}