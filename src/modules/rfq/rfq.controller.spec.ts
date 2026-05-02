import { Test, TestingModule } from '@nestjs/testing';
import { RfqController } from './rfq.controller';
import { RfqService } from './rfq.service';

describe('RfqController', () => {
  let controller: RfqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RfqController],
      providers: [RfqService],
    }).compile();

    controller = module.get<RfqController>(RfqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
