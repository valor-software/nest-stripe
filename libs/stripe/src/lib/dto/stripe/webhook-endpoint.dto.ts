import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../base.dto';

export class WebhookEndpointDto extends BaseDto {
  @ApiProperty()
  apiVersion: string;

  @ApiProperty()
  application: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ isArray: true, type: String})
  enabledEvents: Array<string>;

  @ApiProperty()
  secret: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  url: string;

}