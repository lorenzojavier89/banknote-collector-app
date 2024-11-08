import { Issuer } from "./issuer.model";

export interface Banknote {
  id: string;
  order: number;
  volume: string;
  name: string;
  flagIcon: string;
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
