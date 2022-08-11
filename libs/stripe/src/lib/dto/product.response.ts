import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from './base.response';

export class ProductResponse extends BaseResponse {
  @ApiPropertyOptional()
  productId?: string;

  @ApiPropertyOptional()
  defaultPriceId?: string;
}