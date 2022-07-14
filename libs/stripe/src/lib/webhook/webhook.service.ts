import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import Stripe from 'stripe';

@Injectable()
export class WebhookService {
  private _paymentIntentCreated$ = new Subject<Stripe.Event>();

  get paymentIntentCreated$(): Observable<Stripe.Event> {
    return this._paymentIntentCreated$.asObservable();
  }

  notifyPaymentIntentCreated(evt: Stripe.Event): void {
    this._paymentIntentCreated$.next(evt);
  }
}