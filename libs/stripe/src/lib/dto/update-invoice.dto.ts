import { ApiPropertyOptional } from '@nestjs/swagger';

export class InvoiceVoidInvoiceDto {
  @ApiPropertyOptional({ isArray: true, type: String })
  expand?: Array<string>;
}

export class InvoiceFinalizeInvoiceDto {
  @ApiPropertyOptional()
  autoAdvance?:boolean;

  @ApiPropertyOptional({ isArray: true, type: String })
  expand?: Array<string>;
}
