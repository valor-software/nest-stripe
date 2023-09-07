import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ListRequestParamsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startingAfter?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endingBefore?: string;

}