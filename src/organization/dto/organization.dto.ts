import {
  IsString,
  IsMongoId,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateOrganizationDTO {
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description: string;

  avatar?: any;
}

export class UpdateOrganizationDTO extends PartialType(CreateOrganizationDTO) {}

export class FireUserDTO {
  @IsMongoId()
  @ApiProperty()
  userId: string;

  @IsMongoId()
  @ApiProperty()
  organizationId: string;
}

export class HireUserDTO extends FireUserDTO {
  @ApiProperty()
  @MinLength(2)
  position: string;
}

export class HireWithLoginDTO {
  @ApiProperty()
  login: string;

  @IsMongoId()
  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  @MinLength(2)
  position: string;
}

export class AssignPositionDTO {
  @IsMongoId()
  @ApiProperty()
  userId: string;

  @ApiProperty()
  @MinLength(2)
  position: string;
}
