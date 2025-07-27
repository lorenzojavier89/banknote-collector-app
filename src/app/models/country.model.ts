import { FilterItem } from "./filters/filter-item.model";
import { HistoricalPeriod } from "./historical-period.model";
import { Subgroup } from "./subgroup.model";

export interface Country extends FilterItem {
  code: string;
  name: string;
  flagIcons: string[];
  subgroups: Subgroup[];
  historicalPeriods: HistoricalPeriod[];
}
