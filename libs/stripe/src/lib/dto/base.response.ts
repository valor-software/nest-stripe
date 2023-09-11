import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export abstract class BaseResponse {
  @ApiProperty()
  success?: boolean;

  @ApiPropertyOptional()
  errorCode?: string;

  @ApiPropertyOptional()
  errorMessage?: string;
}

export abstract class BaseDataResponse<T> {
  @ApiProperty()
  success?: boolean;

  @ApiProperty()
  data?: T;

  @ApiPropertyOptional()
  hasMore?: boolean;

  @ApiPropertyOptional()
  errorCode?: string;

  @ApiPropertyOptional()
  errorMessage?: string;
}
