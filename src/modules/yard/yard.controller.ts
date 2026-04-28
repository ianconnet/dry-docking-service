import { Controller } from '@nestjs/common';
import { YardService } from './yard.service';

@Controller('yard')
export class YardController {
  constructor(private readonly yardService: YardService) {}
}
