export interface Banknote {
  id: string;
  order: number;
  volume: string;
  name: string;
  flagIcons: string[];
  regionCode: string;
  subregionCode: string;
  issuerCode: string;
  issuerSubcode: string;
  issueDate: string;
  denomination: string;
  onlineCatalog: string;
  imageUrl: string;
  comment?: string;
}
