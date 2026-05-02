import { Module } from '@nestjs/common';
import { RfqService } from './rfq.service';
import { RfqController } from './rfq.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthorizeGuard } from 'src/guards/authorize.guard';

@Module({
  imports: [AuthModule],
  controllers: [RfqController],
  providers: [RfqService, AuthorizeGuard],
})
export class RfqModule {}
