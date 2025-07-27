import { FilterItemV2 } from "./filters/filter-item-v2.model";
import { HistoricalPeriod } from "./historical-period.model";
import { Subgroup } from "./subgroup.model";

export interface Country extends FilterItemV2 {
  code: string;
  name: string;
  flagIcons: string[];
  subgroups: Subgroup[];
  historicalPeriods: HistoricalPeriod[];
}
