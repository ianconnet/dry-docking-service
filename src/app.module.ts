import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './modules/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PartyModule } from './modules/party/party.module';
import { VesselModule } from './modules/vessel/vessel.module';
import { DrydockModule } from './modules/drydock/drydock.module';
import { AgentModule } from './modules/agent/agent.module';
import { YardModule } from './modules/yard/yard.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { RfqModule } from './modules/rfq/rfq.module';
import { ContractModule } from './modules/contract/contract.module';
import { PlanningModule } from './modules/planning/planning.module';
import { ExecutionModule } from './modules/execution/execution.module';
import { SurveyModule } from './modules/survey/survey.module';
import { FinanceModule } from './modules/finance/finance.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AuditModule } from './modules/audit/audit.module';
import { PrismaModule } from './shared/prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, PartyModule, VesselModule, DrydockModule, AgentModule, YardModule, MarketplaceModule, RfqModule, ContractModule, PlanningModule, ExecutionModule, SurveyModule, FinanceModule, NotificationModule, AuditModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
