import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateRFQDto } from './dtos/create-rfq.dto';
import { CreateRFQResponseDto } from './dtos/rfq-response.dto';

@Injectable()
export class RfqService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRFQDto, userId: string) {
    const { workItems, surveys, ...rfqData } = dto;

    return this.prisma.rFQ.create({
      data: {
        requesterId: userId,
        ...rfqData,
        workItems: workItems?.length ? { create: workItems } : undefined,
        surveys: surveys?.length ? { create: surveys } : undefined,
      },
      include: { workItems: true, surveys: true },
    });
  }

  async findAll(page = 1, limit = 12) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.rFQ.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { workItems: true, surveys: true },
      }),
      this.prisma.rFQ.count(),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id },
      include: { workItems: true, surveys: true },
    });
    if (!rfq) throw new NotFoundException(`RFQ ${id} not found`);
    return rfq;
  }

  async findByImo(imoNumber: string) {
    return this.prisma.rFQ.findMany({
      where: { imoNumber },
      orderBy: { createdAt: 'desc' },
      include: { workItems: true, surveys: true },
    });
  }

  async addWorkItem(
    rfqId: string,
    dto: {
      category: string;
      description: string;
      estimatedQty?: number;
      uom?: string;
      isKnownDefect?: boolean;
    },
  ) {
    await this.findOne(rfqId);
    return this.prisma.rFQWorkItem.create({ data: { rfqId, ...dto } as any });
  }

  async removeWorkItem(itemId: string) {
    return this.prisma.rFQWorkItem.delete({ where: { id: itemId } });
  }

  async addSurvey(
    rfqId: string,
    dto: { type: string; mandatory?: boolean; notes?: string },
  ) {
    await this.findOne(rfqId);
    return this.prisma.rFQSurvey.create({ data: { rfqId, ...dto } as any });
  }

  async removeSurvey(surveyId: string) {
    return this.prisma.rFQSurvey.delete({ where: { id: surveyId } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.rFQ.delete({ where: { id } });
  }

  async getYardOwnersRfqs(yardOwnerId: string, page = 1, limit = 12) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.rFQ.findMany({
        where: { yard: { publisher: yardOwnerId } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { workItems: true, surveys: true },
      }),
      this.prisma.rFQ.count({ where: { yard: { publisher: yardOwnerId } } }),
    ]);

    const dataWithResponse = await Promise.all(
      data.map(async (rfq) => {
        const response = await this.prisma.rFQResponse.findFirst({
          where: {
            rfqId: rfq.id,
            rfq: {
              yard: { publisher: yardOwnerId },
            },
            status: {
              not: 'rejected',
            },
          },
        });
        return { ...rfq, respondedByMe: !!response };
      }),
    );

    return { data: dataWithResponse, total, page, limit };
  }

  async createRfqResponse(dto: CreateRFQResponseDto) {
    try {
      const response = await this.prisma.rFQResponse.create({
        data: {
          rfq: { connect: { id: dto.rfqId } },
          price: dto.price,
          acceptedWorkItems: {
            connect: dto.acceptedWorkItems?.map((id) => ({ id })),
          },
          acceptedSurveys: {
            connect: dto.acceptedSurveys?.map((id) => ({ id })),
          },
        },
      });

      return {
        success: true,
        message: 'RFQ response submitted successfully.',
        data: response,
      };
    } catch (err) {
      console.error('Error creating RFQ response:', err);
      return {
        success: false,
        message: 'Failed to create RFQ response. Please try again later.',
      };
    }
  }

  async getYardOwnerRfqResponses(yardOwnerId: string, rfqId: string) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id: rfqId },
      include: { yard: true },
    });

    if (!rfq || rfq.yard.publisher !== yardOwnerId) {
      return {
        success: false,
        message:
          'RFQ not found or you do not have permission to view responses.',
      };
    }

    const responses = await this.prisma.rFQResponse.findMany({
      where: { rfqId },
      include: {
        acceptedWorkItems: true,
        acceptedSurveys: true,
      },
    });

    return {
      success: true,
      data: responses,
    };
  }

  getVesselOwnersRfqResponses(vesselOwnerId: string, page = 1, limit = 12) {
    const skip = (page - 1) * limit;
    return this.prisma.rFQResponse.findMany({
      where: {
        rfq: {
          requesterId: vesselOwnerId,
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        rfq: true,
        acceptedWorkItems: true,
        acceptedSurveys: true,
      },
    });
  }

  async RejectRfqResponse(
    {
      responseId,
      reason,
    }: {
      responseId: string;
      reason?: string;
    },
    requestor: string,
  ) {
    try {
      const response = await this.prisma.rFQResponse.findUnique({
        where: { id: responseId },
        include: { rfq: true },
      });

      if (!response) {
        return {
          success: false,
          message: 'RFQ response not found.',
        };
      }

      if (response.rfq.requesterId !== requestor) {
        return {
          success: false,
          message: 'You do not have permission to reject this response.',
        };
      }

      await this.prisma.rFQResponse.update({
        where: { id: responseId },
        data: {
          status: 'rejected',
          rejectionReason: reason,
        },
      });

      return {
        success: true,
        message: 'RFQ response rejected successfully.',
      };
    } catch (error) {
      console.log('Error rejecting RFQ response:', error);
      return {
        success: false,
        message: 'Failed to reject RFQ response. Please try again later.',
      };
    }
  }

  async AcceptRfqResponse(
    { responseId }: { responseId: string },
    requestor: string,
  ) {
    try {
      const response = await this.prisma.rFQResponse.findUnique({
        where: { id: responseId },
        include: { rfq: true },
      });

      if (!response) {
        return {
          success: false,
          message: 'RFQ response not found.',
        };
      }

      if (response.rfq.requesterId !== requestor) {
        return {
          success: false,
          message: 'You do not have permission to accept this response.',
        };
      }

      await this.prisma.rFQResponse.update({
        where: { id: responseId },
        data: {
          status: 'accepted',
        },
      });

      return {
        success: true,
        message: 'RFQ response accepted successfully.',
      };
    } catch (error) {
      console.log('Error accepting RFQ response:', error);
      return {
        success: false,
        message: 'Failed to accept RFQ response. Please try again later.',
      };
    }
  }

  async makeWorkItemsSurveysContractable(
    workItemIds: string[],
    surveyIds: string[],
    yardOwnerId: string,
  ) {
    try {
      await this.prisma.rFQWorkItem.updateMany({
        where: {
          id: { in: workItemIds },
          rfq: { yard: { publisher: yardOwnerId } },
        },
        data: { availableForContractors: true },
      });

      await this.prisma.rFQSurvey.updateMany({
        where: {
          id: { in: surveyIds },
          rfq: { yard: { publisher: yardOwnerId } },
        },
        data: { availableForContractors: true },
      });

      return {
        success: true,
        message: 'Work items and surveys are now available for contractors.',
      };
    } catch (error) {
      console.log('Error making work items and surveys contractable:', error);
      return {
        success: false,
        message:
          'Failed to update work items and surveys. Please try again later.',
      };
    }
  }
}
