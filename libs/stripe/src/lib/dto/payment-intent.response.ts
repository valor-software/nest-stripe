import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from './base.response';

export class PaymentIntentResponse extends BaseResponse {
  @ApiPropertyOptional()
  clientSecret?: string;
}
