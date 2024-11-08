import { HistoricalPeriod } from "./historical-period.model";
import { Subgroup } from "./subgroup.model";

export interface Country {
  code: string;
  name: string;
  flagIcon: string;
  subgroups: Subgroup[];
  historicalPeriods: HistoricalPeriod[];
}
