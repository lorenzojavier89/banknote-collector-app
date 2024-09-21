export interface Banknote {
  id: string;
  order: number;
  volume: string;
  region: string;
  subregion: string;
  issuer: string;
  historicalPeriod?: string;
  issueDate: string;
  denomination: string;
  onlineCatalog: string;
  comment?: string;
}
