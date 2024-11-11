import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Query,
  Post,
  RawBodyRequest,
  Req,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
  SetMetadata
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Request } from 'express';
import {
  BaseDataResponse,
  BaseResponse,
  BaseSaveResponse,
  CreateWebhookEndpointDto,
  ListRequestParamsDto,
  UpdateWebhookEndpointDto,
  WebhookEndpointDto
} from '../dto';
import { StripeAuthGuard } from '../stripe-auth.guard';
import { WebhookExceptionFilter } from './webhook.exception.filter';
import { WebhookResponse } from './webhook.interfaces';
import { WebhookService } from './webhook.service';

@SetMetadata('isPublic', true)
@ApiTags('Stripe: Webhooks')
@Controller('stripe/webhooks')
@UseFilters(new WebhookExceptionFilter())
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @ApiResponse({ type: WebhookResponse })
  @Post('events')
  async all(@Req() req: RawBodyRequest<Request>): Promise<WebhookResponse> {
    try {
      const evt = await this.webhookService.buildEvent(req);
      this.webhookService.notify(evt);
      return { success: true }
    } catch (error) {
      this.handleError(error);
    }
  }

  @ApiBearerAuth()
  @UseGuards(StripeAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('webhook-endpoints')
  getWebhookEndpoints(@Query() params?: ListRequestParamsDto): Promise<BaseDataResponse<WebhookEndpointDto[]>> {
    return this.webhookService.webhookEndpoints(params);
  }

  @ApiBearerAuth()
  @UseGuards(StripeAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('webhook-endpoints/:id')
  getWebhookEndpointById(@Param('id') id: string): Promise<BaseDataResponse<WebhookEndpointDto>> {
    return this.webhookService.webhookEndpointById(id);
  }

  @ApiBearerAuth()
  @UseGuards(StripeAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('webhook-endpoints/create')
  createWebhookEndpoint(@Body() dto: CreateWebhookEndpointDto): Promise<BaseSaveResponse> {
    return this.webhookService.createWebhookEndpoint(dto);
  }

  @ApiBearerAuth()
  @UseGuards(StripeAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('webhook-endpoints/:id/update')
  updateWebhookEndpoint(@Param('id') id: string, @Body() dto: UpdateWebhookEndpointDto): Promise<BaseSaveResponse> {
    return this.webhookService.updateWebhookEndpoint(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(StripeAuthGuard)
  @UsePipes(new ValidationPipe())
  @Delete('webhook-endpoints/:id/delete')
  deleteWebhookEndpoint(@Param('id') id: string): Promise<BaseResponse> {
    return this.webhookService.deleteWebhookEndpoint(id);
  }
  

  private handleError(error: any) {
    Logger.error(error, 'Webhook handler');
    throw new BadRequestException(error);
  }
}
