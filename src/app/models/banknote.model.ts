import { Volume } from "./volume.enum";
import { Orientation } from './orientation.enum';

export interface Banknote {
  id: string;
  order: number;
  volume: Volume | null;
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
  orientation: Orientation
}
