import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from './base.response';

export class Invoice {
  @ApiPropertyOptional()
  id?: string
}

export class InvoicePreviewResponse extends BaseResponse {
  @ApiPropertyOptional()
  invoice?: Invoice;
}