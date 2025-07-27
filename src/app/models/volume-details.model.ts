import { FilterItemV2 } from "./filters/filter-item-v2.model";

export interface VolumeDetails extends FilterItemV2 {
  name: string;
  details: string[];
}