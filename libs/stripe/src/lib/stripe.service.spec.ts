import { Test } from '@nestjs/testing';
import { StripeService } from './stripe.service';

describe('StripeService', () => {
  let service: StripeService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [StripeService],
    }).compile();

    service = module.get(StripeService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
