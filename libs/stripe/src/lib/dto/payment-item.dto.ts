import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class PaymentItemDto {
  @ApiPropertyOptional()
  public readonly productId?: string;
  @ApiPropertyOptional()
  public readonly priceId?: string;
  @ApiPropertyOptional()
  public readonly displayName?: string;
  @ApiPropertyOptional()
  public readonly itemId?: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  public readonly price: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  public readonly quantity: number;
  @ApiPropertyOptional()
  public readonly images?: string[];
}
