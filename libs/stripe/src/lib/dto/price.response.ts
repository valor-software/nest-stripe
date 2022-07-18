import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from './base.response';

export class PriceResponse extends BaseResponse {
  @ApiPropertyOptional()
  priceId?: string;
}