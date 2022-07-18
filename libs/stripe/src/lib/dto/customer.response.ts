import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from './base.response';

export class CustomerResponse extends BaseResponse {
  @ApiProperty()
  customerId?: string;
}