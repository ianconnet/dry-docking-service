import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export enum PartyRoleType {
  SHIP_OWNER = 'SHIP_OWNER',
  TECH_MANAGER = 'TECH_MANAGER',
  YARD_OWNER = 'YARD_OWNER',
  MAIN_CONTRACTOR = 'MAIN_CONTRACTOR',
  SUB_CONTRACTOR = 'SUB_CONTRACTOR',
  SHIP_AGENT = 'SHIP_AGENT',
  SURVEYOR = 'SURVEYOR',
  CLASS_SOCIETY = 'CLASS_SOCIETY',
  FLAG_AUTHORITY = 'FLAG_AUTHORITY',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
}

export class CreatePartyDto {
  @IsString()
  legalName: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  taxId?: string;
}

export class UpdatePartyDto {
  @IsOptional()
  @IsString()
  legalName?: string;

  @IsOptional()
  @IsString()
  country?: string;
}

export class AssignRoleDto {
  @IsEnum(PartyRoleType)
  roleType: PartyRoleType;
}

export class SearchPartyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsEnum(PartyRoleType)
  role?: PartyRoleType;
}

export class BulkAssignRolesDto {
  @IsArray()
  data: {
    partyId: string;
    roles: PartyRoleType[];
  }[];
}
