import { Injectable } from '@nestjs/common';
import { filter, Observable, Subject } from 'rxjs';
import Stripe from 'stripe';

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

  private _subscriptionScheduleAborted$ = new Subject<Stripe.Event>();
  private _subscriptionScheduleCanceled$ = new Subject<Stripe.Event>();
  private _subscriptionScheduleCompleted$ = new Subject<Stripe.Event>();
  private _subscriptionScheduleCreated$ = new Subject<Stripe.Event>();
  private _subscriptionScheduleUpdated$ = new Subject<Stripe.Event>();
  private _subscriptionScheduleReleased$ = new Subject<Stripe.Event>();
  private _subscriptionScheduleExpired$ = new Subject<Stripe.Event>();

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

  get subscriptionScheduleAborted$(): Observable<Stripe.Event> {
    return this._subscriptionScheduleAborted$.asObservable();
  }
  get subscriptionScheduleCanceled$(): Observable<Stripe.Event> {
    return this._subscriptionScheduleCanceled$.asObservable();
  }
  get subscriptionScheduleCompleted$(): Observable<Stripe.Event> {
    return this._subscriptionScheduleCompleted$.asObservable();
  }
  get subscriptionScheduleCreated$(): Observable<Stripe.Event> {
    return this._subscriptionScheduleCreated$.asObservable();
  }
  get subscriptionScheduleUpdated$(): Observable<Stripe.Event> {
    return this._subscriptionScheduleUpdated$.asObservable();
  }
  get subscriptionScheduleReleased$(): Observable<Stripe.Event> {
    return this._subscriptionScheduleReleased$.asObservable();
  }
  get subscriptionScheduleExpired$(): Observable<Stripe.Event> {
    return this._subscriptionScheduleExpired$.asObservable();
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

  notifySubscriptionScheduleAborted(evt: Stripe.Event): void {
    this._subscriptionScheduleAborted$.next(evt);
  }
  notifySubscriptionScheduleCanceled(evt: Stripe.Event): void {
    this._subscriptionScheduleCanceled$.next(evt);
  }
  notifySubscriptionScheduleCompleted(evt: Stripe.Event): void {
    this._subscriptionScheduleCompleted$.next(evt);
  }
  notifySubscriptionScheduleCreated(evt: Stripe.Event): void {
    this._subscriptionScheduleCreated$.next(evt);
  }
  notifySubscriptionScheduleUpdated(evt: Stripe.Event): void {
    this._subscriptionScheduleUpdated$.next(evt);
  }
  notifySubscriptionScheduleReleased(evt: Stripe.Event): void {
    this._subscriptionScheduleReleased$.next(evt);
  }
  notifySubscriptionScheduleExpired(evt: Stripe.Event): void {
    this._subscriptionScheduleExpired$.next(evt);
  }

  subscribeToEvent(type: string): Observable<Stripe.Event> {
    return this._all$.pipe(filter(evt => evt.type === type));
  }
}