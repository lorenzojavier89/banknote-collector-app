import { FilterItem } from "./filter-item.model";

export class AppliedFilter {
    readonly regionFilters: FilterItem[];
    readonly subregionFilters: FilterItem[];
    readonly issuerFilter: FilterItem | null;

    anyFilterApplied = () => !!(this.regionFilters.length || this.subregionFilters.length || this.issuerFilter);
    regionFilterCodes = () => this.regionFilters.map(rf => rf.code);
    subregionFilterCodes = () => this.subregionFilters.map(srf => srf.code);
    issuerFilterCode = () => this.issuerFilter?.code;

    constructor(regionFilters: FilterItem[] = [], subregionFilters: FilterItem[] = [], issuerFilter: FilterItem | null = null){
        this.regionFilters = this.Distinct(regionFilters);
        this.subregionFilters = this.Distinct(subregionFilters);
        this.issuerFilter = issuerFilter;
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