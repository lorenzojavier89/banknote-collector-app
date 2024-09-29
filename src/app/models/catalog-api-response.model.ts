export interface CatalogApiResponse {
  id: string;
  order: number;
  volume: string;
  issuerCode: string;
  subgroup: string;
  historicalPeriod?: string;
  issueDate: string;
  denomination: string;
  onlineCatalog: string;
  imageUrl: string;
  comment?: string;
}
