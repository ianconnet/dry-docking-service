import { Test, TestingModule } from '@nestjs/testing';
import { YardService } from './yard.service';

describe('YardService', () => {
  let service: YardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YardService],
    }).compile();

    service = module.get<YardService>(YardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
