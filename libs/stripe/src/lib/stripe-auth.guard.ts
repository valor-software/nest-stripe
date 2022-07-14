import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export const STRIPE_AUTH_GUARD = 'STRIPE_AUTH_GUARD';

@Injectable()
export class StripeAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    @Inject(STRIPE_AUTH_GUARD)
    private readonly authGuard: CanActivate
  ) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return this.authGuard.canActivate(context);
  }
}

