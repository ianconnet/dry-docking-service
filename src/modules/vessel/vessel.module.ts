import { Module } from '@nestjs/common';
import { VesselService } from './vessel.service';
import { VesselController } from './vessel.controller';

@Module({
  controllers: [VesselController],
  providers: [VesselService],
})
export class VesselModule {}
