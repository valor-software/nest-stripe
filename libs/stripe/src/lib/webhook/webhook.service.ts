import { Injectable } from '@nestjs/common';
import { filter, Observable, Subject } from 'rxjs';
import Stripe from 'stripe';
import { WebhookEventType } from './event-types.enum';

@Injectable()
export class WebhookService {
  private _all$ = new Subject<Stripe.Event>();
  private _paymentIntentCreated$ = new Subject<Stripe.Event>();
  private _paymentIntentSucceeded$ = new Subject<Stripe.Event>();
  private _paymentIntentCanceled$ = new Subject<Stripe.Event>();
  private _paymentIntentFailed$ = new Subject<Stripe.Event>();

  private _chargeSucceeded$ = new Subject<Stripe.Event>();
  private _chargeRefunded$ = new Subject<Stripe.Event>();
  private _chargeFailed$ = new Subject<Stripe.Event>();

  private _invoicePaymentSucceeded$ = new Subject<Stripe.Event>();
  private _invoicePaymentFailed$ = new Subject<Stripe.Event>();
  private _invoicePaymentFinalized$ = new Subject<Stripe.Event>();
  
  private _customerSubscriptionDeleted$ = new Subject<Stripe.Event>();
  private _customerSubscriptionTrialWillEnd$ = new Subject<Stripe.Event>();

  get all$(): Observable<Stripe.Event> {
    return this._all$.asObservable();
  }

  get paymentIntentCreated$(): Observable<Stripe.Event> {
    return this._paymentIntentCreated$.asObservable();
  }
  get paymentIntentSucceeded$(): Observable<Stripe.Event> {
    return this._paymentIntentSucceeded$.asObservable();
  }
  get paymentIntentCanceled$(): Observable<Stripe.Event> {
    return this._paymentIntentCanceled$.asObservable();
  }
  get paymentIntentFailed$(): Observable<Stripe.Event> {
    return this._paymentIntentFailed$.asObservable();
  }

  get chargeSucceeded$(): Observable<Stripe.Event> {
    return this._chargeSucceeded$.asObservable();
  }
  get chargeRefunded$(): Observable<Stripe.Event> {
    return this._chargeRefunded$.asObservable();
  }
  get chargeFailed$(): Observable<Stripe.Event> {
    return this._chargeFailed$.asObservable();
  }

  get invoicePaymentSucceeded$(): Observable<Stripe.Event> {
    return this._invoicePaymentSucceeded$.asObservable();
  }
  get invoicePaymentFailed$(): Observable<Stripe.Event> {
    return this._invoicePaymentFailed$.asObservable();
  }
  get invoicePaymentFinalized$(): Observable<Stripe.Event> {
    return this._invoicePaymentFinalized$.asObservable();
  }

  get customerSubscriptionDeleted$(): Observable<Stripe.Event> {
    return this._customerSubscriptionDeleted$.asObservable();
  }
  get customerSubscriptionTrialWillEnd$(): Observable<Stripe.Event> {
    return this._customerSubscriptionTrialWillEnd$.asObservable();
  }

  notifyAll(evt: Stripe.Event): void {
    this._all$.next(evt);
  }

  notifyPaymentIntentCreated(evt: Stripe.Event): void {
    this._paymentIntentCreated$.next(evt);
  }
  notifyPaymentIntentSucceeded(evt: Stripe.Event): void {
    this._paymentIntentSucceeded$.next(evt);
  }
  notifyPaymentIntentCanceled(evt: Stripe.Event): void {
    this._paymentIntentCanceled$.next(evt);
  }
  notifyPaymentIntentFailed(evt: Stripe.Event): void {
    this._paymentIntentFailed$.next(evt);
  }

  notifyChargeSucceeded(evt: Stripe.Event): void {
    this._chargeSucceeded$.next(evt);
  }
  notifyChargeRefunded(evt: Stripe.Event): void {
    this._chargeRefunded$.next(evt);
  }
  notifyChargeFailed(evt: Stripe.Event): void {
    this._chargeFailed$.next(evt);
  }

  notifyInvoicePaymentSucceeded(evt: Stripe.Event): void {
    this._invoicePaymentSucceeded$.next(evt);
  }
  notifyInvoicePaymentFailed(evt: Stripe.Event): void {
    this._invoicePaymentFailed$.next(evt);
  }
  notifyInvoicePaymentFinalized(evt: Stripe.Event): void {
    this._invoicePaymentFinalized$.next(evt);
  }

  notifyCustomerSubscriptionDeleted(evt: Stripe.Event): void {
    this._customerSubscriptionDeleted$.next(evt);
  }
  notifyCustomerSubscriptionTrialWillEnd(evt: Stripe.Event): void {
    this._customerSubscriptionTrialWillEnd$.next(evt);
  }

  subscribeToEvent(type: WebhookEventType): Observable<Stripe.Event> {
    return this._all$.pipe(filter(evt => evt.type === type));
  }
}