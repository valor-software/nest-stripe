import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from './base.response';
import { InvoiceDto } from './stripe/invoice.dto';

export class InvoicePreviewResponse extends BaseResponse {
  @ApiPropertyOptional({ type: InvoiceDto })
  invoice?: InvoiceDto;
}