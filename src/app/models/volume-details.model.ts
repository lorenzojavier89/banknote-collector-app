import { FilterItem } from "./filters/filter-item.model";

export interface VolumeDetails extends FilterItem {
  name: string;
  details: string[];
}