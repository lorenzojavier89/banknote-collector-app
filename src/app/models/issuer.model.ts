import { Country } from './country.model';

export interface Issuer {
  country: Country;
  subregionCode: string;
  subregionName: string;
  regionCode: string;
  regionName: string;
}
