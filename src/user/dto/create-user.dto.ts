import {
  IsEmail,
  IsString,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsEnum,
  IsPhoneNumber,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { genderEnum } from '../enums/gender.enum';
import { ProfessionDto } from './profession.dto';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly surname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly patronymic: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(genderEnum)
  readonly gender: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  readonly birthdate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z](.[a-zA-Z0-9_-]*)$/, { message: 'Invalid login' })
  readonly login: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
    { message: 'Weak password' },
  )
  @ApiProperty()
  readonly password: string;

  @IsOptional()
  @ApiPropertyOptional()
  readonly  avatar: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsPhoneNumber('RU')
  readonly telephone: string;

  @IsOptional()
  @ApiPropertyOptional()
  readonly profession: [ProfessionDto];
}
