import {
  WorkCategory,
  SurveyType,
  DockingType,
} from 'prisma/generated/prisma/client/enums';

export class CreateRFQWorkItemDto {
  category: WorkCategory;
  description: string;
  estimatedQty?: number;
  uom?: string;
  isKnownDefect?: boolean;
}

export class CreateRFQSurveyDto {
  type: SurveyType;
  mandatory?: boolean;
  notes?: string;
}

export class CreateRFQDto {
  yardId: string;
  vesselId: string;
  vesselName: string;
  imoNumber: string;
  vesselType?: string;

  loa?: number;
  beam?: number;
  draft?: number;
  dwt?: number;

  classSociety?: string;

  dockingType: DockingType;
  preferredStart: Date;
  flexibilityDays?: number;
  estimatedDuration?: number;

  workItems?: CreateRFQWorkItemDto[];
  surveys?: CreateRFQSurveyDto[];
}
