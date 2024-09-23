import { Issuer } from "./issuer.model";

export interface Banknote {
  id: string;
  order: number;
  volume: string;
  issuer: Issuer;
  issueDate: string;
  denomination: string;
  onlineCatalog: string;
  comment?: string;
}
