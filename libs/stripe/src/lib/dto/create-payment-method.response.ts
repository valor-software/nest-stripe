import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from './base.response';

export class CreatePaymentMethodResponse extends BaseResponse {
  @ApiPropertyOptional()
  paymentMethodId?: string;
}
