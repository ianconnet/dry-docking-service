import { Module } from '@nestjs/common';
import { DrydockService } from './drydock.service';
import { DrydockController } from './drydock.controller';

@Module({
  controllers: [DrydockController],
  providers: [DrydockService],
})
export class DrydockModule {}
