import { Country } from './country.model';
import { Region } from './region.model';
import { Subregion } from './subregion.model';

export interface Issuer {
  country: Country;
  subregion: Subregion;
  region: Region;
  historicalPeriod?: string;
  subgroup?: string;
}
