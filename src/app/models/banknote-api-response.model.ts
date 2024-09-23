export interface BanknoteApiResponse {
  id: string;
  order: number;
  volume: string;
  issuerCode: string;
  subgroup: string;
  historicalPeriod?: string;
  issueDate: string;
  denomination: string;
  onlineCatalog: string;
  comment?: string;
}
