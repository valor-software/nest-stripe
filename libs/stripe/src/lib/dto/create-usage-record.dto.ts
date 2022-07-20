import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateUsageRecordDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional({ enum: ['increment', 'set'], default: 'increment'})
  action?: 'increment' | 'set';

  @ApiProperty()
  timestamp?: 'now' | number;
}