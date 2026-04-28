import { Controller } from '@nestjs/common';
import { RfqService } from './rfq.service';

@Controller('rfq')
export class RfqController {
  constructor(private readonly rfqService: RfqService) {}
}
