import {
  UseGuards,
  UsePipes,
  ValidationPipe,
  Controller,
  Post,
  Body,
  Param,
  Get
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  BaseDataResponse,
  CreatePriceDto,
  PriceDto,
  PriceResponse,
  UpdatePriceDto
} from '../dto';
import { StripeAuthGuard } from '../stripe-auth.guard';
import { StripeService } from '../stripe.service';

@ApiBearerAuth()
@ApiTags('Stripe: Price')
@UseGuards(StripeAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('stripe/price')
export class PriceController {
  constructor(private stripeService: StripeService) {}

  @ApiResponse({ type: PriceResponse })
  @Post('create')
  createPrice(@Body() dto: CreatePriceDto): Promise<PriceResponse> {
    return this.stripeService.createPrice(dto);
  }

  @ApiResponse({ type: PriceResponse })
  @Post(':priceId/update')
  updatePrice(
    @Param('priceId') priceId: string,
    @Body() dto: UpdatePriceDto
  ): Promise<PriceResponse> {
    return this.stripeService.updatePrice(priceId, dto);
  }

  @ApiResponse({ type: BaseDataResponse })
  @Get('')
  priceList(): Promise<BaseDataResponse<PriceDto[]>> {
    return this.stripeService.getPriceList();
  }

  @ApiResponse({ type: BaseDataResponse<PriceDto> })
  @Get(':priceId')
  priceById(@Param('priceId') priceId: string): Promise<BaseDataResponse<PriceDto>> {
    return this.stripeService.getPriceById(priceId);
  }

}