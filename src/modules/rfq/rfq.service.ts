import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateRFQDto } from './dtos/create-rfq.dto';

@Injectable()
export class RfqService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRFQDto, userId: string) {
    const { workItems, surveys, ...rfqData } = dto;

    return this.prisma.rFQ.create({
      data: {
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
}
