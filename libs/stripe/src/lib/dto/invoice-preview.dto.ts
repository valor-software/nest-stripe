import { ApiProperty } from '@nestjs/swagger';

export class InvoicePreviewDto {
  @ApiProperty()
  customerId: string;
  @ApiProperty()
  subscriptionId: string;
}
