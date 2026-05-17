import { Module } from '@nestjs/common';
import { ContractorService } from './contractor.service';
import { ContractorController } from './contractor.controller';
import { AuthorizeGuard } from 'src/guards/authorize.guard';
import { AuthModule } from '../auth/auth.module';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [AuthModule],
  controllers: [ContractorController],
  providers: [ContractorService, AuthorizeGuard, NotificationService],
})
export class ContractorModule {}
