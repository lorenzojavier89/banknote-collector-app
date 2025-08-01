import { Condition } from './condition.model';
import { Orientation } from './orientation.enum';
import { VolumeType } from "./volume-type.enum";

export interface Banknote {
  id: string;
  order: number;
  volume: VolumeType | null;
  name: string;
  flagIcons: string[];
  regionCode: string;
  regionName: string;
  subregionCode: string;
  subregionName: string;
  issuerCode: string;
  issuerName: string;
  issuerSubcode: string;
  issuerSubname: string;
  issueDate: string;
  issueMinDate: number;
  issueMaxDate: number;
  denomination: string;
  onlineCatalog: string;
  imageUrl: string;
  comment: string;
  info: string;
  orientation: Orientation;
  condition: Condition | null;
  rarityIndex: number;
  uncUSD: number;
}
