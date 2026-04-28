import { Controller } from '@nestjs/common';
import { VesselService } from './vessel.service';

@Controller('vessel')
export class VesselController {
  constructor(private readonly vesselService: VesselService) {}
}
