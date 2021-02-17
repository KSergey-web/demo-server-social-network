import {
  IsEmail,
  IsString,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsEnum,
  IsPhoneNumber,
  IsDate,
  MinLength,
  MaxLength,
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