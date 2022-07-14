import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from './base.response';

export class CreatePaymentResponse extends BaseResponse {
  @ApiPropertyOptional()
  id?: string;
}
