import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from './base.response';

export class CreateCustomerResponse extends BaseResponse {
  @ApiProperty()
  customerId?: string;
}