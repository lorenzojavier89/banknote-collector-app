import { Volume } from "./volume.enum";

export interface Banknote {
  id: string;
  order: number;
  volume: Volume | undefined;
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
