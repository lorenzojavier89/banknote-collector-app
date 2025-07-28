import { FilterItem } from "./filters/filter-item.model";
import { Subregion } from "./subregion.model";

export interface Region extends FilterItem {
  code: string;
  name: string;
  subregions: Subregion[];
}
