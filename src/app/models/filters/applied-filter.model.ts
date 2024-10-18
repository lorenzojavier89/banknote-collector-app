export class AppliedFilter {
    regionCodes: string[];
    subregionCodes: string[];
    countryCode: string;
    anyFilterApplied = () => !!(this.regionCodes.length || this.subregionCodes.length || this.countryCode);

    constructor(regionCodes: string[] = [], subregionCodes: string[] = [], countryCode: string = ''){
        this.regionCodes = [...new Set(regionCodes)];
        this.subregionCodes = [...new Set(subregionCodes)];
        this.countryCode = countryCode;
    }
}