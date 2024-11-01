import { FilterItem } from "./filter-item.model";

export class AppliedFilter {
    readonly regionFilters: FilterItem[];
    readonly regionFilterCodes: string[];
    readonly subregionFilters: FilterItem[];
    readonly subregionFilterCodes: string[];

    countryCode: string;
    anyFilterApplied = () => !!(this.regionFilters.length || this.subregionFilters.length || this.countryCode);

    constructor(regionFilters: FilterItem[] = [], subregionFilters: FilterItem[] = [], countryCode: string = ''){
        this.regionFilters = [...new Set(regionFilters)];
        this.regionFilterCodes = regionFilters.map(rf => rf.code);

        this.subregionFilters = [...new Set(subregionFilters)];
        this.subregionFilterCodes = subregionFilters.map(srf => srf.code);

        this.countryCode = countryCode;
    }
}