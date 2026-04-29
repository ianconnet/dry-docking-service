import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateYardDTO } from './dtos/create.dto';

@Injectable()
export class YardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateYardDTO, publisher: string) {
    try {
      const existingYard = await this.prisma.yard.findFirst({
        where: {
          name: dto.name,
          publisher: publisher,
        },
      });

      if (existingYard) {
        return {
          success: false,
          message:
            'A yard with the same name already exists for this publisher.',
        };
      }

      const newYard = await this.prisma.yard.create({
        data: {
          name: dto.name,
          description: dto.description,
          location: dto.location,
          publisher: publisher,
        },
      });

      return {
        success: true,
        message: 'Yard created successfully.',
        data: newYard,
      };
    } catch (error) {
      console.log('ERROR: ', error);
    }
  }

  async publishYard(id: string, publisher: string) {
    try {
      const updatedYard = await this.prisma.yard.updateMany({
        where: {
          id: id,
          publisher: publisher,
        },
        data: {
          published: true,
        },
      });

      if (updatedYard.count === 0) {
        return {
          success: false,
          message: 'Yard not found or you are not the publisher.',
        };
      }

      return {
        success: true,
        message: 'Yard published successfully.',
      };
    } catch (error) {
      console.log('ERROR: ', error);
      return {
        success: false,
        message: 'An error occurred while publishing the yard.',
      };
    }
  }
}
