import { Country } from "./country.model";
import { FilterItemV2 } from "./filters/filter-item-v2.model";

export interface Subregion extends FilterItemV2 {
  code: string;
  name: string;
  issuers: Country[];
}
