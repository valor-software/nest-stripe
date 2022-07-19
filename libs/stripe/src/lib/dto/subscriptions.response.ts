import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from './base.response';
import { SubscriptionDto } from './subscription.dto';
export class SubscriptionsResponse extends BaseResponse {
  @ApiPropertyOptional({isArray: true, type: SubscriptionDto })
  subscriptions?: SubscriptionDto[];
}