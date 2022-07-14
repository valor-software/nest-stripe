import { Test } from '@nestjs/testing';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

describe('StripeController', () => {
  let controller: StripeController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [StripeService],
      controllers: [StripeController],
    }).compile();

    controller = module.get(StripeController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
