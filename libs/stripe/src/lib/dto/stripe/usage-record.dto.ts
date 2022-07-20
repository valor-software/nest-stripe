import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../base.dto';

export class UsageRecordDto extends BaseDto {
  @ApiProperty()
  quantity: number;

  @ApiProperty()
  subscriptionItem: string;

  @ApiProperty()
  timestamp: number;
}
