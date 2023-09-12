import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseSearchInvoiceDto {
  @ApiProperty()
  query: string;

  @ApiPropertyOptional({ isArray: true, type: String })
  expand?: Array<string>;

  @ApiPropertyOptional()
  limit?: number;

  @ApiPropertyOptional()
  page?: string;
}
