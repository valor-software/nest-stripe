import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from './base.response';

export class SubscriptionResponse extends BaseResponse {
  @ApiPropertyOptional()
  subscriptionId?: string;
  @ApiPropertyOptional()
  clientSecret?: string;
}