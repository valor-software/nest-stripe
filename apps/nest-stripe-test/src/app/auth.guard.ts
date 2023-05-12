import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

export const STRIPE_AUTH_GUARD = 'STRIPE_AUTH_GUARD';

@Injectable()
export class AppAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const v = Date.now() % 2
    if (v === 0) {
      return Promise.resolve(true)
    }
    if (v === 2) {
      return of(true)
    }
    return true;
  }
}
