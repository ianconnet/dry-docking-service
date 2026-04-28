import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { PartyService } from './party.service';
import {
  CreatePartyDto,
  UpdatePartyDto,
  AssignRoleDto,
  SearchPartyDto,
  BulkAssignRolesDto,
} from './dtos';

@Controller('parties')
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Post()
  create(@Body() dto: CreatePartyDto) {
    return this.partyService.createParty(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.partyService.getAllParties(query);
  }

  @Get('search')
  search(@Query() dto: SearchPartyDto) {
    return this.partyService.searchParties(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partyService.getPartyById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePartyDto) {
    return this.partyService.updateParty(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partyService.deleteParty(id);
  }

  // Roles

  @Post(':id/roles')
  assignRole(@Param('id') id: string, @Body() dto: AssignRoleDto) {
    return this.partyService.assignRole(id, dto.roleType);
  }

  @Get(':id/roles')
  getRoles(@Param('id') id: string) {
    return this.partyService.getRolesByParty(id);
  }

  @Delete(':id/roles/:roleType')
  removeRole(@Param('id') id: string, @Param('roleType') roleType: any) {
    return this.partyService.removeRole(id, roleType);
  }

  // Bulk

  @Post('assign-role-bulk')
  bulkAssign(@Body() dto: BulkAssignRolesDto) {
    return this.partyService.assignRolesBulk(dto.data);
  }
}
