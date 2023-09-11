import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SaveTestClockDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  frozenTime?: number = Date.now();

}

export class AdvanceTestClockDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  frozenTime?: number = Date.now();

}
