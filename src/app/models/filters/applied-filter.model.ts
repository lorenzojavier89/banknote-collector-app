import { FilterItem } from "./filter-item.model";

export interface AppliedFilter {
    regionFilters: FilterItem[];
    regionFilterCodes: string[];
    subregionFilters: FilterItem[];
    subregionFilterCodes: string[];
    issuerFilter: FilterItem | null;
    issuerFilterCode: string | null;
    someFiltersApplied: boolean;
    noFiltersApplied: boolean;
}