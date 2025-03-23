import { Injectable } from '@angular/core';
import { AppliedFilter } from '../models/filters/applied-filter.model';
import { FilterItem } from '../models/filters/filter-item.model';

@Injectable({
  providedIn: 'root'
})
export class FiltersBuilderService {

  buildFromRegion(regionFilter: FilterItem): AppliedFilter {
    const subregionFilters = regionFilter.subItems ?? [];

    return this.buildFromRegions([regionFilter], subregionFilters);
  }

  buildFromRegions(regionFilters: FilterItem[], subregionFilters: FilterItem[]): AppliedFilter {
    const dRegionFilters = this.Distinct(regionFilters);
    const dSubregionFilters = this.Distinct(subregionFilters);
    const someFiltersApplied = dRegionFilters.length > 0 || dSubregionFilters.length > 0;
    const noFiltersApplied = !someFiltersApplied;
        
    return {
      regionFilters: dRegionFilters,
      regionFilterCodes: dRegionFilters.map(rf => rf.code),
      subregionFilters: dSubregionFilters,
      subregionFilterCodes: dSubregionFilters.map(srf => srf.code),
      issuerFilter: null,
      issuerFilterCode: null,
      volumeFilter: null,
      volumeFilterCode: null,
      someFiltersApplied,
      noFiltersApplied
    }    
  }

  buildFromIssuer(issuerFilterItem: FilterItem | null): AppliedFilter {
    return {
      regionFilters: [],
      regionFilterCodes: [],
      subregionFilters: [],
      subregionFilterCodes: [],
      issuerFilter: issuerFilterItem,
      issuerFilterCode: issuerFilterItem? issuerFilterItem.code : null,
      volumeFilter: null,
      volumeFilterCode: null,
      someFiltersApplied: issuerFilterItem !== null,
      noFiltersApplied: issuerFilterItem === null
    }    
  }

  buildFromVolume(volumeFilterItem: FilterItem): AppliedFilter {
    return {
      regionFilters: [],
      regionFilterCodes: [],
      subregionFilters: [],
      subregionFilterCodes: [],
      issuerFilter: null,
      issuerFilterCode: null,
      volumeFilter: volumeFilterItem,
      volumeFilterCode: volumeFilterItem.code,
      someFiltersApplied: true,
      noFiltersApplied: false
    }  
  }

  buildEmtpy(): AppliedFilter {
    return {
      regionFilters: [],
      regionFilterCodes: [],
      subregionFilters: [],
      subregionFilterCodes: [],
      issuerFilter: null,
      issuerFilterCode: null,
      volumeFilter: null,
      volumeFilterCode: null,
      someFiltersApplied: false,
      noFiltersApplied: true
    }  
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
