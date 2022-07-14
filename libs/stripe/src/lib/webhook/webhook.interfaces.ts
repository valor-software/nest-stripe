import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WebhookResponse {
  @ApiProperty()
  success: boolean;
  @ApiPropertyOptional()
  error?: any;
}