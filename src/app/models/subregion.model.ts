import { Country } from "./country.model";

export interface Subregion {
  code: string;
  name: string;
  issuers: Country[];
}
