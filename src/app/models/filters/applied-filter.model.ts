import { Country } from "../country.model";
import { Region } from "../region.model";
import { Subregion } from "../subregion.model";
import { VolumeDetails } from "../volume-details.model";

export interface AppliedFilter {
    regionFilters: Region[];
    regionFilterCodes: string[];
    subregionFilters: Subregion[];
    subregionFilterCodes: string[];
    issuerFilter: Country | null;
    issuerFilterCode: string | null;
    volumeFilter: VolumeDetails | null;
    volumeFilterName: string | null;
    someFiltersApplied: boolean;
    noFiltersApplied: boolean;
}