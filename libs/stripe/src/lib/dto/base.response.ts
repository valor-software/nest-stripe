import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export abstract class BaseResponse {
  @ApiProperty()
  success?: boolean;
  @ApiPropertyOptional()
  errorCode?: string;
  @ApiPropertyOptional()
  errorMessage?: string;
}
