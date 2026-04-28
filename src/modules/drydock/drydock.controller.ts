import { Controller } from '@nestjs/common';
import { DrydockService } from './drydock.service';

@Controller('drydock')
export class DrydockController {
  constructor(private readonly drydockService: DrydockService) {}
}
