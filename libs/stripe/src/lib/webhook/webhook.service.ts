import { Injectable, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { filter, Observable, Subject } from 'rxjs';
import Stripe from 'stripe';
import { BaseDataResponse, BaseResponse, BaseSaveResponse, CreateWebhookEndpointDto, UpdateWebhookEndpointDto, WebhookEndpointDto } from '../dto';
import { StripeService } from '../stripe.service';
import { WebhookEventType } from './event-types.enum';

@Injectable()
export class WebhookService {
  private _notify$ = new Subject<Stripe.Event>();

  get notify$(): Observable<Stripe.Event> {
    return this._notify$.asObservable();
  }

  constructor(private readonly stripeService: StripeService) {}

  buildEvent(req: RawBodyRequest<Request>): Promise<Stripe.Event> {
    const payload = req.rawBody.toString('utf-8');
      const headerSignature = req.header('stripe-signature');
      return this.stripeService.buildWebhookEvent(payload, headerSignature);
  }

  notify(evt: Stripe.Event): void {
    this._notify$.next(evt);
  }

  subscribeToEvent(type: WebhookEventType): Observable<Stripe.Event> {
    return this._notify$.pipe(
      filter(evt => type === WebhookEventType.all || evt.type === type)
    );
  }

  webhookEndpoints(): Promise<BaseDataResponse<WebhookEndpointDto[]>>  {
    return this.stripeService.webhookEndpoints();
  }

  webhookEndpointById(webhookEndpointId: string): Promise<BaseDataResponse<WebhookEndpointDto>> {
    return this.stripeService.webhookEndpointById(webhookEndpointId);
  }

  createWebhookEndpoint(dto: CreateWebhookEndpointDto): Promise<BaseSaveResponse> {
    return this.stripeService.createWebhookEndpoint(dto);
  }

  updateWebhookEndpoint(webhookEndpointId: string, dto: UpdateWebhookEndpointDto): Promise<BaseSaveResponse> {
    return this.stripeService.updateWebhookEndpoint(webhookEndpointId, dto);
  }

  deleteWebhookEndpoint(webhookEndpointId: string): Promise<BaseResponse> {
    return this.stripeService.deleteWebhookEndpoint(webhookEndpointId);
  }

}