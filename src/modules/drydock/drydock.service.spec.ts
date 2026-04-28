import { Test, TestingModule } from '@nestjs/testing';
import { DrydockService } from './drydock.service';

describe('DrydockService', () => {
  let service: DrydockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrydockService],
    }).compile();

    service = module.get<DrydockService>(DrydockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
