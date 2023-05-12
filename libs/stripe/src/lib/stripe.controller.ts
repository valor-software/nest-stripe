import { Controller, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StripeAuthGuard } from './stripe-auth.guard';
import { StripeService } from './stripe.service';

@ApiBearerAuth()
@ApiTags('stripe')
@UseGuards(StripeAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('stripe')
export class StripeController {
  constructor(protected stripeService: StripeService) {}
}
