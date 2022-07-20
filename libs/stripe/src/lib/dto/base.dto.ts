import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  object: string;

  @ApiProperty()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Time at which the object was created. Measured in seconds since the Unix epoch.'
  })
  created?: number;

  @ApiProperty()
  liveMode?: boolean;

  @ApiPropertyOptional()
  metadata?: {[name: string]: string | number | null};

  @ApiPropertyOptional()
  updated?: number;
}
