import { IsString, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateOrganizationDTO {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  avatar: string;
}

export class UpdateOrganizationDTO  extends PartialType(CreateOrganizationDTO) {}

export class FireUserDTO {
  @IsMongoId()
  @ApiProperty()
  userId: string;

  @IsMongoId()
  @ApiProperty()
  organizationId: string;
}
