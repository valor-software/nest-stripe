import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentItemDto {
  @ApiProperty()
  public readonly id: string;
  @ApiProperty()
  public readonly displayName: string;
  @ApiProperty()
  public readonly itemId: string;
  @ApiProperty()
  public readonly price: number;
  @ApiProperty()
  public readonly quantity?: number;
  @ApiPropertyOptional()
  public readonly images?: string[];
}
