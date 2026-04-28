import { Test, TestingModule } from '@nestjs/testing';
import { YardController } from './yard.controller';
import { YardService } from './yard.service';

describe('YardController', () => {
  let controller: YardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YardController],
      providers: [YardService],
    }).compile();

    controller = module.get<YardController>(YardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
