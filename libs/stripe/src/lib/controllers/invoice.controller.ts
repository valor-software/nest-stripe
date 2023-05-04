import {
  UseGuards,
  UsePipes,
  ValidationPipe,
  Controller,
  Post,
  Body,
  Param,
  Get} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  BaseDataResponse,
  InvoiceDto,
  InvoicePreviewDto,
  InvoicePreviewResponse
} from '../dto';
import { StripeAuthGuard } from '../stripe-auth.guard';
import { StripeService } from '../stripe.service';

@ApiBearerAuth()
@ApiTags('Stripe: Invoice')
@UseGuards(StripeAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('stripe/invoice')
export class InvoiceController {
  constructor(private stripeService: StripeService) {}

  @ApiResponse({ type: BaseDataResponse<InvoiceDto> })
  @Get(':invoiceId')
  getInvoiceById(@Param('invoiceId') invoiceId: string): Promise<BaseDataResponse<InvoiceDto>> {
    return this.stripeService.getInvoiceById(invoiceId);
  }

  @ApiResponse({ type: InvoicePreviewResponse })
  @ApiTags('Stripe: Invoice')
  @Post('retrieve-upcoming')
  retrieveUpcomingInvoice(@Body() dto: InvoicePreviewDto): Promise<InvoicePreviewResponse> {
    return this.stripeService.upcomingInvoicePreview(dto);
  }

}