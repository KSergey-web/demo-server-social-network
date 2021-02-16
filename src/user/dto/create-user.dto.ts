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
import { genderEnum } from '../enums/gender.enum';

/*export class CreateUserDto {
  @ApiProperty()
  @MinLength(4)
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
}*/

export class LoginDTO {
  @IsString()
  @MinLength(4)
  login: string;

  @IsString()
  @MinLength(4)
  password: string;
}

export class RegisterDTO extends LoginDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  login: string;
}


export interface AuthPayload {
  login: string;
}