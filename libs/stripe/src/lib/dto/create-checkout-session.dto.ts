import { ApiProperty } from '@nestjs/swagger';
import { PaymentItemDto } from './payment-item.dto';

export class CreateCheckoutSessionDto {
  @ApiProperty({ type: PaymentItemDto, isArray: true })
  items: PaymentItemDto[];
  @ApiProperty()
  metadata?: { [name: string]: string | number | null };
}
