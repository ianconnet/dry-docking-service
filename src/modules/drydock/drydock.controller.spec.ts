import { Test, TestingModule } from '@nestjs/testing';
import { DrydockController } from './drydock.controller';
import { DrydockService } from './drydock.service';

describe('DrydockController', () => {
  let controller: DrydockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrydockController],
      providers: [DrydockService],
    }).compile();

    controller = module.get<DrydockController>(DrydockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
