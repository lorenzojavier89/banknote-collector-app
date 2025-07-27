import { FilterItemV2 } from "./filters/filter-item-v2.model";
import { Subregion } from "./subregion.model";

export interface Region extends FilterItemV2 {
  code: string;
  name: string;
  subregions: Subregion[];
}
