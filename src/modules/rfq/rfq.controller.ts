import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RfqService } from './rfq.service';
import {
  CreateRFQDto,
  CreateRFQSurveyDto,
  CreateRFQWorkItemDto,
} from './dtos/create-rfq.dto';
import { AuthorizeGuard } from 'src/guards/authorize.guard';
import { Authorize } from 'src/guards/authorize.decorator';
import { GroupPolicy } from 'src/proto-interfaces/authorize';
import { UserId } from 'src/decorators/userId.decorator';
import { CreateRFQResponseDto } from './dtos/rfq-response.dto';

@Controller('rfq')
export class RfqController {
  constructor(private readonly rfqService: RfqService) {}

  // POST /rfq
  @Authorize(GroupPolicy.REQUESTS)
  @UseGuards(AuthorizeGuard)
  @Post()
  create(@Body() dto: CreateRFQDto, @UserId() userId: string) {
    return this.rfqService.create(dto, userId);
  }

  // GET /rfq
  @Authorize(GroupPolicy.REQUESTS)
  @UseGuards(AuthorizeGuard)
  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.rfqService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 12,
    );
  }

  // GET /rfq/imo/:imoNumber
  @Authorize(GroupPolicy.REQUESTS)
  @UseGuards(AuthorizeGuard)
  @Get('imo/:imoNumber')
  findByImo(@Param('imoNumber') imoNumber: string) {
    return this.rfqService.findByImo(imoNumber);
  }

  // GET /rfq/:id
  @Authorize(GroupPolicy.REQUESTS)
  @UseGuards(AuthorizeGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rfqService.findOne(id);
  }

  // DELETE /rfq/:id
  @Authorize(GroupPolicy.REQUESTS)
  @UseGuards(AuthorizeGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rfqService.remove(id);
  }

  // POST /rfq/:id/work-items
  @Authorize(GroupPolicy.REQUESTS)
  @UseGuards(AuthorizeGuard)
  @Post(':id/work-items')
  addWorkItem(@Param('id') id: string, @Body() dto: CreateRFQWorkItemDto) {
    return this.rfqService.addWorkItem(id, dto);
  }

  // DELETE /rfq/work-items/:itemId
  @Authorize(GroupPolicy.REQUESTS)
  @UseGuards(AuthorizeGuard)
  @Delete('work-items/:itemId')
  removeWorkItem(@Param('itemId') itemId: string) {
    return this.rfqService.removeWorkItem(itemId);
  }

  // POST /rfq/:id/surveys
  @Authorize(GroupPolicy.REQUESTS)
  @UseGuards(AuthorizeGuard)
  @Post(':id/surveys')
  addSurvey(@Param('id') id: string, @Body() dto: CreateRFQSurveyDto) {
    return this.rfqService.addSurvey(id, dto);
  }

  // DELETE /rfq/surveys/:surveyId
  @Authorize(GroupPolicy.REQUESTS)
  @UseGuards(AuthorizeGuard)
  @Delete('surveys/:surveyId')
  removeSurvey(@Param('surveyId') surveyId: string) {
    return this.rfqService.removeSurvey(surveyId);
  }

  // GET /rfq/yard-owner/:yardOwnerId
  @Authorize(GroupPolicy.REQUESTS)
  @UseGuards(AuthorizeGuard)
  @Get('yard-owner/:yardOwnerId')
  getYardOwnersRfqs(
    @Param('yardOwnerId') yardOwnerId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.rfqService.getYardOwnersRfqs(
      yardOwnerId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 12,
    );
  }

  @Post('response')
  createRfqResponse(@Body() dto: CreateRFQResponseDto) {
    return this.rfqService.createRfqResponse(dto);
  }

  @Authorize(GroupPolicy.REQUESTS)
  @UseGuards(AuthorizeGuard)
  @Get('responses/:rfqId')
  getYardOwnerRfqResponses(
    @Param('rfqId') rfqId: string,
    @UserId() yardOwnerId: string,
  ) {
    return this.rfqService.getYardOwnerRfqResponses(yardOwnerId, rfqId);
  }

  // VESSELOWNER ENDPOINTS
  @Authorize(GroupPolicy.REQUESTS)
  @UseGuards(AuthorizeGuard)
  @Get('vessel-owner/responses')
  getVesselOwnersRfqResponses(
    @UserId() vesselOwnerId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.rfqService.getVesselOwnersRfqResponses(
      vesselOwnerId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 12,
    );
  }

  @Put('vessel-owner/responses/reject')
  @Authorize(GroupPolicy.REQUESTS)
  @UseGuards(AuthorizeGuard)
  RejectRfqResponse(
    @Body() body: { responseId: string; reason?: string },
    @UserId() requestor: string,
  ) {
    return this.rfqService.RejectRfqResponse(body, requestor);
  }

  @Put('vessel-owner/responses/accept')
  @Authorize(GroupPolicy.REQUESTS)
  @UseGuards(AuthorizeGuard)
  AcceptRfqResponse(
    @Body() body: { responseId: string },
    @UserId() requestor: string,
  ) {
    return this.rfqService.AcceptRfqResponse(body, requestor);
  }

  @Put('yard-owner/items/contractable')
  @Authorize(GroupPolicy.REQUESTS)
  @UseGuards(AuthorizeGuard)
  makeWorkItemsSurveysContractable(
    @Body()
    body: {
      workItemIds: string[];
      surveyIds: string[];
    },
    @UserId() yardOwnerId: string,
  ) {
    return this.rfqService.makeWorkItemsSurveysContractable(
      body.workItemIds,
      body.surveyIds,
      yardOwnerId,
    );
  }
}
