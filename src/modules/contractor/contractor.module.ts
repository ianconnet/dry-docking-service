import { Module } from '@nestjs/common';
import { ContractorService } from './contractor.service';
import { ContractorController } from './contractor.controller';
import { AuthorizeGuard } from 'src/guards/authorize.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ContractorController],
  providers: [ContractorService, AuthorizeGuard],
})
export class ContractorModule {}
