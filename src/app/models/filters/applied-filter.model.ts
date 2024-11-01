import { FilterItem } from "./filter-item.model";

export class AppliedFilter {
    readonly regionFilters: FilterItem[];
    readonly subregionFilters: FilterItem[];
    

    countryCode: string;
    anyFilterApplied = () => !!(this.regionFilters.length || this.subregionFilters.length || this.countryCode);
    regionFilterCodes = () => this.regionFilters.map(rf => rf.code);
    subregionFilterCodes = () => this.subregionFilters.map(srf => srf.code);

    constructor(regionFilters: FilterItem[] = [], subregionFilters: FilterItem[] = [], countryCode: string = ''){
        this.regionFilters = this.Distinct(regionFilters);
        this.subregionFilters = this.Distinct(subregionFilters);
        this.countryCode = countryCode;
    }

    private Distinct(filters: FilterItem[]): FilterItem[] {
        let codes = new Set<string>();
        let results: FilterItem[] = []; 

        filters.forEach(f => {
            if(!codes.has(f.code)) {
                codes.add(f.code);
                results.push(f);
            }
        });

        return results;
    }
}