export interface CatalogApiResponse {
  id: string;
  order: number;
  volume: string;
  issuerCode: string;
  issuerSubcode: string;
  issueDate: string;
  denomination: string;
  onlineCatalog: string;
  imageUrl: string;
  comment: string;
  info: string;
  orientation: string;
  condition: string;
  rarityIndex: number;
  uncUSD: number;
}
