import {
  UseGuards,
  UsePipes,
  ValidationPipe,
  Controller,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Get} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AdvanceTestClockDto, BaseDataResponse, BaseResponse, ListRequestParamsDto, SaveTestClockDto, TestClockDto } from '../dto';
import { StripeAuthGuard } from '../stripe-auth.guard';
import { StripeService } from '../stripe.service';

@ApiBearerAuth()
@ApiTags('Stripe: TestClocks')
@UseGuards(StripeAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('stripe/testClock')
export class TestClocksController {
  constructor(private stripeService: StripeService) {}

  @ApiResponse({ type: BaseDataResponse<TestClockDto> })
  @Post('create')
  createTestClock(@Body() dto: SaveTestClockDto): Promise<BaseDataResponse<TestClockDto>> {
    return this.stripeService.createTestClock(dto.frozenTime, dto.name);
  }

  @ApiResponse({ type: BaseDataResponse<TestClockDto> })
  @Post(':testClockId/advance')
  advanceTestClock(
    @Param('testClockId') testClockId: string,
    @Body() dto: AdvanceTestClockDto
  ): Promise<BaseDataResponse<TestClockDto>> {
    return this.stripeService.advanceTestClock(testClockId, dto.frozenTime);
  }

  @ApiResponse({ type: BaseDataResponse<TestClockDto> })
  @Get(':testClockId')
  getTestClockById(
    @Param('testClockId') testClockId: string,
  ): Promise<BaseDataResponse<TestClockDto>> {
    return this.stripeService.getTestClockById(testClockId);
  }

  @ApiResponse({ type: BaseDataResponse<TestClockDto[]> })
  @Get(':testClockId')
  getTestClockList(
    @Query() params: ListRequestParamsDto,
  ): Promise<BaseDataResponse<TestClockDto[]>> {
    return this.stripeService.getTestClockList(params);
  }

  @ApiResponse({ type: BaseResponse })
  @Delete(':testClockId/cancel')
  deleteTestClock(@Param('testClockId') testClockId: string): Promise<BaseResponse> {
    return this.stripeService.deleteTestClock(testClockId);
  }

}