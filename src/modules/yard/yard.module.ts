import { Module } from '@nestjs/common';
import { YardService } from './yard.service';
import { YardController } from './yard.controller';

@Module({
  controllers: [YardController],
  providers: [YardService],
})
export class YardModule {}
