import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponse } from './base.response';
import { UpcomingInvoiceDto } from './stripe/invoice.dto';

export class InvoicePreviewResponse extends BaseResponse {
  @ApiPropertyOptional({ type: UpcomingInvoiceDto })
  invoice?: UpcomingInvoiceDto;
}