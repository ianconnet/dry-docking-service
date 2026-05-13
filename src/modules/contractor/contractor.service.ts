import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateContractRequestDto } from './dtos/contract.dto';

@Injectable()
export class ContractorService {
  constructor(private readonly prisma: PrismaService) {}

  async getContractAbleItems(page = 1, limit = 12) {
    const skip = (page - 1) * (limit / 2);
    const itemLimit = Math.ceil(limit / 2);
    const surveyLimit = Math.floor(limit / 2);

    const [data, total] = await Promise.all([
      this.prisma.rFQWorkItem.findMany({
        where: { availableForContractors: true },
        skip,
        take: itemLimit,
      }),
      this.prisma.rFQWorkItem.count({
        where: { availableForContractors: true },
      }),
    ]);

    const [surveys, totalSurveys] = await Promise.all([
      this.prisma.rFQSurvey.findMany({
        where: { availableForContractors: true },
        skip,
        take: surveyLimit,
      }),
      this.prisma.rFQSurvey.count({
        where: { availableForContractors: true },
      }),
    ]);

    return {
      data: {
        workItems: data,
        surveys,
      },
      total: total + totalSurveys,
      page,
      limit,
    };
  }

  async createContractRequest(
    dto: CreateContractRequestDto,
    contractorId: string,
  ) {
    try {
      const data: any = {
        contractorId,
        minPrice: parseFloat(dto.minPrice),
        maxPrice: parseFloat(dto.maxPrice),
        startDate: dto.startDate,
      };

      if (dto.workItemId) {
        data.workItem = { connect: { id: dto.workItemId } };
      }
      if (dto.surveyId) {
        data.survey = { connect: { id: dto.surveyId } };
      }

      const contractRequest = await this.prisma.contractRequest.create({
        data,
      });

      return {
        success: true,
        message: 'Contract request created successfully',
        data: contractRequest,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.log('ERROR creating contract request', errorMessage);
      return {
        success: false,
        message: 'Error creating contract request',
      };
    }
  }
}
