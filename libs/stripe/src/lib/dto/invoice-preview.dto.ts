import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InvoicePreviewDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  customerId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subscriptionId: string;
}
