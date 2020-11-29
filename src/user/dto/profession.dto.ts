import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfessionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly organization: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly position: string;
}
