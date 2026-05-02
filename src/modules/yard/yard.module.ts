import { Module } from '@nestjs/common';
import { YardService } from './yard.service';
import { YardController } from './yard.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthorizeGuard } from 'src/guards/authorize.guard';

@Module({
  imports: [AuthModule],
  controllers: [YardController],
  providers: [YardService, AuthorizeGuard],
})
export class YardModule {}
