import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ContractorService } from './contractor.service';
import { AuthorizeGuard } from 'src/guards/authorize.guard';
import { CreateContractRequestDto } from './dtos/contract.dto';
import { UserId } from 'src/decorators/userId.decorator';
import { Authorize } from 'src/guards/authorize.decorator';
import { GroupPolicy } from 'src/proto-interfaces/authorize';

@Controller('contractor')
export class ContractorController {
  constructor(private readonly contractorService: ContractorService) {}

  @UseGuards(AuthorizeGuard)
  @Get('jobs')
  async getJobs(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.contractorService.getContractAbleItems(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 12,
    );
  }

  @UseGuards(AuthorizeGuard)
  @Authorize(GroupPolicy.REQUESTS)
  @Post('request')
  async createContract(
    @Body() dto: CreateContractRequestDto,
    @UserId() contractorId: string,
  ) {
    return this.contractorService.createContractRequest(dto, contractorId);
  }
}
