import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import {
  CreatePartyDto,
  UpdatePartyDto,
  SearchPartyDto,
  PartyRoleType,
} from './dtos';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class PartyService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async createParty(dto: CreatePartyDto) {
    return this.prisma.party.create({
      data: dto,
    });
  }

  // READ ALL
  async getAllParties(query: any) {
    return this.prisma.party.findMany({
      include: { roles: true },
    });
  }

  // READ ONE
  async getPartyById(id: string) {
    const party = await this.prisma.party.findUnique({
      where: { id },
      include: { roles: true },
    });

    if (!party) throw new NotFoundException('Party not found');

    return party;
  }

  // UPDATE
  async updateParty(id: string, dto: UpdatePartyDto) {
    await this.validatePartyExists(id);

    return this.prisma.party.update({
      where: { id },
      data: dto,
    });
  }

  // DELETE
  async deleteParty(id: string) {
    await this.validatePartyExists(id);

    return this.prisma.party.delete({
      where: { id },
    });
  }

  // ROLE ASSIGNMENT
  async assignRole(partyId: string, roleType: PartyRoleType) {
    await this.validatePartyExists(partyId);

    const exists = await this.prisma.partyRole.findUnique({
      where: {
        partyId_roleType: {
          partyId,
          roleType,
        },
      },
    });

    if (exists) {
      throw new BadRequestException('Role already assigned');
    }

    return this.prisma.partyRole.create({
      data: {
        partyId,
        roleType,
      },
    });
  }

  async removeRole(partyId: string, roleType: PartyRoleType) {
    return this.prisma.partyRole.delete({
      where: {
        partyId_roleType: {
          partyId,
          roleType,
        },
      },
    });
  }

  async getRolesByParty(partyId: string) {
    return this.prisma.partyRole.findMany({
      where: { partyId },
    });
  }

  // SEARCH
  async searchParties(dto: SearchPartyDto) {
    return this.prisma.party.findMany({
      where: {
        legalName: dto.name
          ? { contains: dto.name, mode: 'insensitive' }
          : undefined,
        country: dto.country || undefined,
        roles: dto.role
          ? {
              some: {
                roleType: dto.role,
              },
            }
          : undefined,
      },
      include: { roles: true },
    });
  }

  // BULK ROLE ASSIGN
  async assignRolesBulk(data: { partyId: string; roles: PartyRoleType[] }[]) {
    const results = [];

    for (const item of data) {
      for (const role of item.roles) {
        try {
          const res = await this.assignRole(item.partyId, role);
          results.push(res);
        } catch (e) {
          // skip duplicates or errors
        }
      }
    }

    return results;
  }

  // VALIDATION HELPERS
  async validatePartyExists(partyId: string) {
    const exists = await this.prisma.party.findUnique({
      where: { id: partyId },
    });

    if (!exists) {
      throw new NotFoundException('Party not found');
    }

    return exists;
  }

  async validatePartyHasRole(partyId: string, role: PartyRoleType) {
    const exists = await this.prisma.partyRole.findUnique({
      where: {
        partyId_roleType: {
          partyId,
          roleType: role,
        },
      },
    });

    if (!exists) {
      throw new BadRequestException(`Party does not have role ${role}`);
    }
  }
}
