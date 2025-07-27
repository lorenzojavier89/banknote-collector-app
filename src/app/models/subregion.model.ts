import { Country } from "./country.model";
import { FilterItem } from "./filters/filter-item.model";

export interface Subregion extends FilterItem {
  code: string;
  name: string;
  issuers: Country[];
}
