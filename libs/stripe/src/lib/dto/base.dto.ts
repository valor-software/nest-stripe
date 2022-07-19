import { ApiProperty } from '@nestjs/swagger';

export class BaseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  object: string;

  @ApiProperty({
    description: 'Time at which the object was created. Measured in seconds since the Unix epoch.'
  })
  created: number;

  @ApiProperty()
  liveMode: boolean;

  @ApiProperty()
  metadata: {[name: string]: string | number | null};
}
