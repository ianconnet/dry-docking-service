import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { YardService } from './yard.service';
import { CreateYardDTO } from './dtos/create.dto';
import { UseGuards } from '@nestjs/common';
import { AuthorizeGuard } from 'src/guards/authorize.guard';
import { Authorize } from 'src/guards/authorize.decorator';
import { GroupPolicy } from 'src/proto-interfaces/authorize';
import { UserId } from 'src/decorators/userId.decorator';

@Controller('yard')
export class YardController {
  constructor(private readonly yardService: YardService) {}

  @Authorize(GroupPolicy.CREATE_YARD)
  @UseGuards(AuthorizeGuard)
  @Post()
  async createYard(
    @Body() createYardDto: CreateYardDTO,
    @UserId() userId: string,
  ) {
    return this.yardService.create(createYardDto, userId);
  }

  @Authorize(GroupPolicy.CREATE_YARD)
  @UseGuards(AuthorizeGuard)
  @Post(':id/publish')
  async publishYard(@Param('id') id: string, @UserId() userId: string) {
    return this.yardService.publishYard(id, userId);
  }

  @Authorize(GroupPolicy.CREATE_YARD)
  @UseGuards(AuthorizeGuard)
  @Get()
  async getUserYards(
    @UserId() userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.yardService.getUserYards(
      userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 12,
    );
  }

  @Get('published')
  async getPublishedYards(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.yardService.getPublishedYards(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 12,
    );
  }
}
