export class CreateRFQResponseDto {
  rfqId: string;
  price: number;
  acceptedWorkItems: string[]; // Array of work item IDs that the supplier is accepting
  acceptedSurveys: string[]; // Array of survey IDs that the supplier is accepting
}
