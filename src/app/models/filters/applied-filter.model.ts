import { Country } from "../country.model";
import { Region } from "../region.model";
import { Subregion } from "../subregion.model";
import { FilterItem } from "./filter-item.model";

export interface AppliedFilter {
    regionFilters: Region[];
    regionFilterCodes: string[];
    subregionFilters: Subregion[];
    subregionFilterCodes: string[];
    issuerFilter: Country | null;
    issuerFilterCode: string | null;
    volumeFilter: FilterItem | null;
    volumeFilterCode: string | null;
    someFiltersApplied: boolean;
    noFiltersApplied: boolean;
}