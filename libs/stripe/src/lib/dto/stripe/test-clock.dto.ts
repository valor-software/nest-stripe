import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../base.dto';
import Stripe from 'stripe';

const TestClockStatuses = ['advancing', 'internal_failure', 'ready']

export class TestClockDto extends BaseDto {
  @ApiProperty()
  name: string;

  @ApiProperty({
    description: 'Time at which this clock is scheduled to auto delete.'
  })
  deletesAfter: number;

  @ApiProperty({
    description: 'Time at which all objects belonging to this clock are frozen.'
  })
  frozenTime: number;

  @ApiProperty({ enum: TestClockStatuses})
  status: Stripe.TestHelpers.TestClock.Status;
}