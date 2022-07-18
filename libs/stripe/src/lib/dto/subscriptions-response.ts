import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from './base.response';

export class Subscription {
  @ApiPropertyOptional()
  id?: string;
}

export class SubscriptionsResponse extends BaseResponse {
  @ApiPropertyOptional({isArray: true })
  subscriptions?: Subscription[];
}