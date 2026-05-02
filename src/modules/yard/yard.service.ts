import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateYardDTO } from './dtos/create.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class YardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

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
      return {
        success: false,
        message: 'An error occurred while creating the yard.',
      };
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

  async getUserYards(publisher: string, page = 1, limit = 12) {
    try {
      const skip = (page - 1) * limit;
      const [yards, total] = await Promise.all([
        this.prisma.yard.findMany({
          where: { publisher },
          skip,
          take: limit,
        }),
        this.prisma.yard.count({ where: { publisher } }),
      ]);

      return {
        success: true,
        data: yards,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.log('ERROR: ', error);
      return {
        success: false,
        message: 'An error occurred while fetching yards.',
      };
    }
  }

  async getPublishedYards(page = 1, limit = 12) {
    try {
      const skip = (page - 1) * limit;

      const [yards, total] = await Promise.all([
        this.prisma.yard.findMany({
          where: { published: true },
          skip,
          take: limit,
        }),
        this.prisma.yard.count({ where: { published: true } }),
      ]);

      const publisherCache = new Map();

      const yardsWithPublisherInfo = (
        await Promise.all(
          yards.map(async (yard) => {
            if (!publisherCache.has(yard.publisher)) {
              const publisherInfo = await this.authService.getUserById(
                yard.publisher,
              );

              if (!publisherInfo) {
                return null;
              }

              publisherCache.set(yard.publisher, publisherInfo);
            }
            return {
              ...yard,
              publisherInfo: publisherCache.get(yard.publisher),
            };
          }),
        )
      ).filter((yard) => yard !== null);

      return {
        success: true,
        data: yardsWithPublisherInfo,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.log('ERROR: ', error);
      return {
        success: false,
        message: 'An error occurred while fetching published yards.',
      };
    }
  }
}
