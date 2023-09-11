import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListRequestParamsDto {
  @ApiPropertyOptional()
  limit?: number;

  @ApiPropertyOptional()
  startingAfter?: string;

  @ApiPropertyOptional()
  endingBefore?: string;

}