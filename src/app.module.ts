import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { YardModule } from './modules/yard/yard.module';
import { RfqModule } from './modules/rfq/rfq.module';

@Module({
  imports: [AuthModule, UserModule, YardModule, PrismaModule, RfqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
