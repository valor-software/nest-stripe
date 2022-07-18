import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from './base.response';

export class CheckoutSessionResponse extends BaseResponse {
  @ApiPropertyOptional()
  sessionId?: string;
}
